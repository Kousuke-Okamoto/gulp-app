// main.js
import $ from 'jquery';
import { showAlert } from "./sub";
import { header} from './components/_header';

showAlert();
header();

$("#js-alert-button").css("font-size", "30px");