jest.dontMock('../ACLAuthStore');
jest.dontMock('../../utils');
jest.dontMock('../../actions/ACLAuthActions');
jest.dontMock('../../../../src/js/config/Config');
jest.dontMock('../../../../src/js/mixins/GetSetMixin');

var JestUtil = require('../../../../src/js/utils/JestUtil');

JestUtil.unMockStores(['ACLAuthStore']);

var cookie = require('cookie');

var ACLAuthStore = require('../ACLAuthStore');
var ActionTypes = require('../../constants/ActionTypes');
var AppDispatcher = require('../../../../src/js/events/AppDispatcher');
var EventTypes = require('../../constants/EventTypes');
var RequestUtil = require('../../../../src/js/utils/RequestUtil');
const USER_COOKIE_KEY = 'dcos-acs-info-cookie';

global.atob = global.atob || function () {
  return JSON.stringify({uid: 'joe', description: 'Joe Doe'});
};

describe('ACLAuthStore', function () {

  beforeEach(function () {
    this.cookieParse = cookie.parse;
    global.document = {cookie: ''};
  });

  afterEach(function () {
    cookie.parse = this.cookieParse;
  });

  describe('#isLoggedIn', function () {
    it('returns false if there is no cookie set', function () {
      cookie.parse = function () {
        var cookieObj = {};
        cookieObj[USER_COOKIE_KEY] = '';
        return cookieObj;
      };
      expect(ACLAuthStore.isLoggedIn()).toEqual(false);
    });

    it('returns true if there is a cookie set', function () {
      cookie.parse = function () {
        var cookieObj = {};
        cookieObj[USER_COOKIE_KEY] = 'aRandomCode';
        return cookieObj;
      };
      expect(ACLAuthStore.isLoggedIn()).toEqual(true);
    });
  });

  describe('#processLogoutSuccess', function () {
    beforeEach(function () {
      this.document = global.document;
      spyOn(cookie, 'serialize');
      spyOn(ACLAuthStore, 'emit');
      ACLAuthStore.processLogoutSuccess();
    });

    afterEach(function () {
      global.document = this.document;
    });

    it('should set the cookie to an empty string', function () {
      var args = cookie.serialize.mostRecentCall.args;

      expect(args[0]).toEqual(USER_COOKIE_KEY);
      expect(args[1]).toEqual('');
    });

    it('should emit a logout event', function () {
      var args = ACLAuthStore.emit.mostRecentCall.args;

      expect(args[0]).toEqual(EventTypes.ACL_AUTH_USER_LOGOUT_SUCCESS);
    });
  });

  describe('#login', function () {
    it('should make a request to login', function () {
      RequestUtil.json = jasmine.createSpy();
      ACLAuthStore.login({});

      expect(RequestUtil.json).toHaveBeenCalled();
    });
  });

  describe('#getUser', function () {
    beforeEach(function () {
      cookie.parse = function () {
        var cookieObj = {};
        // {uid: 'joe', description: 'Joe Doe'}
        cookieObj[USER_COOKIE_KEY] =
          'eyJ1aWQiOiJqb2UiLCJkZXNjcmlwdGlvbiI6IkpvZSBEb2UifQ==';
        return cookieObj;
      };
    });

    afterEach(function () {
      ACLAuthStore.set({role: undefined});
    });

    it('should get the user', function () {
      expect(ACLAuthStore.getUser())
        .toEqual({uid: 'joe', description: 'Joe Doe'});
    });

  });

  describe('#isAdmin', function () {

    afterEach(function () {
      ACLAuthStore.resetRole();
    });

    it('should return false before processing role', function () {
      expect(ACLAuthStore.isAdmin()).toEqual(false);
    });

    it('should return true after success', function () {
      ACLAuthStore.makeAdminRole();

      expect(ACLAuthStore.isAdmin()).toEqual(true);
    });

    it('should return false after error', function () {
      ACLAuthStore.makeDefaultRole();

      expect(ACLAuthStore.isAdmin()).toEqual(false);
    });

  });

  describe('dispatcher', function () {

    describe('logout', function () {

      it('dispatches the correct event upon success', function () {
        var mockedFn = jasmine.createSpy();
        ACLAuthStore.addChangeListener(
          EventTypes.ACL_AUTH_USER_LOGOUT_SUCCESS,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_LOGOUT_SUCCESS
        });

        expect(mockedFn.calls.length).toEqual(1);
      });

      it('dispatches the correct event upon error', function () {
        var mockedFn = jest.genMockFunction();
        ACLAuthStore.addChangeListener(
          EventTypes.ACL_AUTH_USER_LOGOUT_ERROR,
          mockedFn
        );
        AppDispatcher.handleServerAction({
          type: ActionTypes.REQUEST_ACL_LOGOUT_ERROR
        });

        expect(mockedFn.mock.calls.length).toEqual(1);
      });

    });

  });

});