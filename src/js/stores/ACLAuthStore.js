import cookie from "cookie";

import ACLAuthActions from "../events/ACLAuthActions";
import ActionTypes from "../constants/ActionTypes";
import ACLAuthConstants from "../constants/ACLAuthConstants";
import ACLUserRoles from "../constants/ACLUserRoles";
import AppDispatcher from "../events/AppDispatcher";
import EventTypes from "../constants/EventTypes";
import GetSetMixin from "../mixins/GetSetMixin";
import Store from "../utils/Store";

function getUserMetadata() {
  return cookie.parse(global.document.cookie)[ACLAuthConstants.userCookieKey];
}

var ACLAuthStore = Store.createStore({
  storeID: "auth",

  mixins: [GetSetMixin],

  getSet_data: {
    role: ACLUserRoles.default
  },

  addChangeListener: function (eventName, callback) {
    this.on(eventName, callback);
  },

  removeChangeListener: function (eventName, callback) {
    this.removeListener(eventName, callback);
  },

  login: ACLAuthActions.login,

  fetchRole: ACLAuthActions.fetchRole,

  isLoggedIn: function () {
    return !!getUserMetadata();
  },

  logout: function () {
    // Set the cookie to an empty string.
    global.document.cookie = cookie.serialize(
      ACLAuthConstants.userCookieKey, "", {expires: new Date(1970)}
    );

    this.resetRole();
    this.emit(EventTypes.ACL_AUTH_USER_LOGOUT);
  },

  getUser: function () {
    let userCode = getUserMetadata();

    if (!userCode) {
      return null;
    }

    try {
      let user = JSON.parse(atob(userCode));
      if (!this.get("role")) {
        this.fetchRole(user.uid);
      }

      return user;
    } catch(err) {
      return null;
    }
  },

  isAdmin() {
    return this.get("role") === ACLUserRoles.admin;
  },

  makeAdmin() {
    let role = this.get("role");
    if (role !== ACLUserRoles.admin) {
      this.set({role: ACLUserRoles.admin});
      this.emit(EventTypes.ACL_AUTH_USER_ROLE_CHANGED);
    }
  },

  resetRole() {
    let role = this.get("role");
    if (role !== ACLUserRoles.default) {
      this.set({role: ACLUserRoles.default});
      this.emit(EventTypes.ACL_AUTH_USER_ROLE_CHANGED);
    }
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    let source = payload.source;
    if (source !== ActionTypes.SERVER_ACTION) {
      return false;
    }

    let action = payload.action;

    switch (action.type) {
      // Get ACLs for resource
      case ActionTypes.REQUEST_ACL_LOGIN_SUCCESS:
        ACLAuthStore.emit(EventTypes.ACL_AUTH_USER_LOGIN_CHANGED);
        break;
      // Get ACLs for resource
      case ActionTypes.REQUEST_ACL_LOGIN_ERROR:
        ACLAuthStore.emit(EventTypes.ACL_AUTH_USER_LOGIN_ERROR, action.data);
        break;
      // Get role of current user
      case ActionTypes.REQUEST_ACL_ROLE_SUCCESS:
        ACLAuthStore.makeAdmin();
        break;
      // Get role of current user
      case ActionTypes.REQUEST_ACL_ROLE_ERROR:
        ACLAuthStore.resetRole();
        break;
    }

    return true;
  })
});

module.exports = ACLAuthStore;
