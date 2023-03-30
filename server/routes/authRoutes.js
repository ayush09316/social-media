import express from "express";
import {resetPassword,forgetPassword, login,reset}from "../controller/auth.js";

const router=express.Router();

router.route("/login").post(login);
router.route("/forgetPassword").post(forgetPassword);
router.route("/resetPassword/:token").post(resetPassword).get(reset);


export default router;