// main.js
import $ from 'jquery';
import { showAlert } from "./sub";
import { header } from './components/_header';
import smoothscroll from 'smoothscroll-polyfill';
import { scroll } from './components/_scroll';

showAlert();
header();
smoothscroll.polyfill();//polyfill
scroll();

$("#js-alert-button").css("font-size", "30px");