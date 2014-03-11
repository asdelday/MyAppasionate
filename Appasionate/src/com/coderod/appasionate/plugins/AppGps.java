package com.coderod.appasionate.plugins;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

public class AppGps extends CordovaPlugin {
	public static final String ACTION_GPS_ON = "gps_on";

	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) throws JSONException {
		if (action.equals(ACTION_GPS_ON)) {
			String message = "HOLA";
			this.echo(message, callbackContext);
			return true;
		}
		return false;
	}

	private void echo(String message, CallbackContext callbackContext) {
		if (message != null && message.length() > 0) {
			callbackContext.success(message);
		} else {
			callbackContext.error("Expected one non-empty string argument.");
		}
	}
}
