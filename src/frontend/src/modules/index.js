import { combineReducers } from "@reduxjs/toolkit";

import { default as main } from "modules/main";
import { default as auth } from "modules/auth";

export default combineReducers({ main, auth });
