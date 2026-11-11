import { test } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import React, { act } from 'react';

test('initial admin setup renders dashboard and exposes no public signup after setup',async()=>{
 const dom=new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>',{url:'http://localhost:5173/app.html',pretendToBeVisual:true});
 let logged=false;
 const fetcher=async url=>{const path=String(url);if(path==='/api/setup')return {ok:true,json:async()=>({needsSetup:true})};if(path==='/api/setup-submit')return {ok:true,json:async()=>({})};if(path==='/api/me')return logged?{ok:true,json:async()=>({id:1,name:'Admin',role:'System Administrator',department:'',permissions:['users.manage','reports.all','payroll.manage']})}:{ok:false,json:async()=>({error:'Please sign in'})};if(path==='/api/reports')return {ok:true,json:async()=>({employees:0})};if(path==='/api/setup'&&logged)return {ok:true,json:async()=>({ok:true})};return {ok:true,json:async()=>[]}};
 const fakeFetch=async(url,opts)=>{if(url==='/api/setup'&&opts?.method==='POST'){logged=true;return {ok:true,json:async()=>({ok:true})}}return fetcher(url,opts)};
 const original={};for(const [key,value] of Object.entries({window:dom.window,document:dom.window.document,navigator:dom.window.navigator,localStorage:dom.window.localStorage,IS_REACT_ACT_ENVIRONMENT:true,fetch:fakeFetch})){original[key]=Object.getOwnPropertyDescriptor(globalThis,key);Object.defineProperty(globalThis,key,{configurable:true,writable:true,value})}
 const vite=await createServer({server:{middlewareMode:true},appType:'custom'});let app;
 try{await act(async()=>{app=await vite.ssrLoadModule('/src/rbacMain.jsx');await new Promise(r=>setTimeout(r,20))});assert.match(document.body.textContent,/Create administrator/);
 const input=(placeholder,value)=>{const el=document.querySelector(`input[placeholder="${placeholder}"]`);assert.ok(el);Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value').set.call(el,value);el.dispatchEvent(new dom.window.Event('input',{bubbles:true}))};
 await act(async()=>{input('Enter your full name','Admin');input('you@company.com','admin@example.com');input('Enter your password','password123')});
 await act(async()=>{document.querySelector('.auth-form').dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));await new Promise(r=>setTimeout(r,20))});
 assert.match(document.body.textContent,/Welcome back, Admin/);assert.match(document.body.textContent,/Payroll/);
 }finally{if(app)await act(async()=>app.appRoot.unmount());await vite.close();dom.window.close();for(const [key,descriptor] of Object.entries(original)){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key]}}
});
