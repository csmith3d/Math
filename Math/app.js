////////////////////////////////////////////
// Math
//
// Copyright 2020 Casey Smith
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use, copy,
// modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
// BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
////////////////////////////////////////////


////////////////////////////////////////////
// Globals

//Speech rate on apple devices (ios, macos) is faster
// than android and windows, so we need to know
// if we're on an apple device
var isMac = navigator.userAgent.toLowerCase().indexOf("mac os") > -1;

//For keeping track of what's happening
var state=0;
var voiceGetterInterval;
var counter = 0;
var numPositiveVoiceCheck = 0;
var initializedSpeech = 0;

//Math lists
var questionLists = [
["1 x 2", "2 x 2", "3 x 2", "4 x 2", "5 x 2", "6 x 2", "7 x 2", "8 x 2", "9 x 2", "10 x 2", "11 x 2", "12 x 2"],
["1 x 3", "2 x 3", "3 x 3", "4 x 3", "5 x 3", "6 x 3", "7 x 3", "8 x 3", "9 x 3", "10 x 3", "11 x 3", "12 x 3"],
["1 x 4", "2 x 4", "3 x 4", "4 x 4", "5 x 4", "6 x 4", "7 x 4", "8 x 4", "9 x 4", "10 x 4", "11 x 4", "12 x 4"],
["1 x 5", "2 x 5", "3 x 5", "4 x 5", "5 x 5", "6 x 5", "7 x 5", "8 x 5", "9 x 5", "10 x 5", "11 x 5", "12 x 5"],
["1 x 6", "2 x 6", "3 x 6", "4 x 6", "5 x 6", "6 x 6", "7 x 6", "8 x 6", "9 x 6", "10 x 6", "11 x 6", "12 x 6"],
["1 x 7", "2 x 7", "3 x 7", "4 x 7", "5 x 7", "6 x 7", "7 x 7", "8 x 7", "9 x 7", "10 x 7", "11 x 7", "12 x 7"],
["1 x 8", "2 x 8", "3 x 8", "4 x 8", "5 x 8", "6 x 8", "7 x 8", "8 x 8", "9 x 8", "10 x 8", "11 x 8", "12 x 8"],
["1 x 9", "2 x 9", "3 x 9", "4 x 9", "5 x 9", "6 x 9", "7 x 9", "8 x 9", "9 x 9", "10 x 9", "11 x 9", "12 x 9"],
["1 x 10", "2 x 10", "3 x 10", "4 x 10", "5 x 10", "6 x 10", "7 x 10", "8 x 10", "9 x 10", "10 x 10", "11 x 10", "12 x 10"],
["1 x 11", "2 x 11", "3 x 11", "4 x 11", "5 x 11", "6 x 11", "7 x 11", "8 x 11", "9 x 11", "10 x 11", "11 x 11", "12 x 11"],
["1 x 12", "2 x 12", "3 x 12", "4 x 12", "5 x 12", "6 x 12", "7 x 12", "8 x 12", "9 x 12", "10 x 12", "11 x 12", "12 x 12"]
];
var answerLists = [
["2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "22", "24"],
["3", "6", "9", "12", "15", "18", "21", "24", "27", "30", "33", "36"],
["4", "8", "12", "16", "20", "24", "28", "32", "36", "40", "44", "48"],
["5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55", "60"],
["6", "12", "18", "24", "30", "36", "42", "48", "54", "60", "66", "72"],
["7", "14", "21", "28", "35", "42", "49", "56", "63", "70", "77", "84"],
["8", "16", "24", "32", "40", "48", "56", "64", "72", "80", "88", "96"],
["9", "18", "27", "36", "45", "54", "63", "72", "81", "90", "99", "108"],
["10", "20", "30", "40", "50", "60", "70", "80", "90", "100", "110", "120"],
["11", "22", "33", "44", "55", "66", "77", "88", "99", "110", "121", "132"],
["12", "24", "36", "48", "60", "72", "84", "96", "108", "120", "132", "144"]
];
var hintLists = [
["", "same as 2 + 2", "same as 3 + 3", "same as 4 + 4", "same as 5 + 5", "same as 6 + 6", "same as 7 + 7", "same as 8 + 8", "same as 9 + 9", "same as 10 + 10", "same as 11 + 11", "same as 12 + 12"],
["", "", "", "", "", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", "", "", "", "", ""],
["", "", "", "", "", "", "", "", "", "", "", ""]
];

var correct = [];
var currList = 0;
var currQuestions = [];
var currAnswers = [];
var currHints = [];
var currIndex = 0;
var failOnCurrent = 0;


//Parameters the user can change
var lang = "en-gb";
var rate = 1.0;
//if(isMac) {
//    rate = 1.4;
//}
var voiceIndex;

//General storage
var voices;

//References to DOM elements
var readyElem;
var settingsElem;
var speechVoiceSelectorElem;
var speechRateSelectorElem;
var mathListSelectorElem;
var settingsButtonElem;
var okButtonElem;
var cancelButtonElem;
var guessElem;
var advanceButtonElem;
var progressDivElem;
var promptElem;

// Globals
///////////////////////////////////////////




///////////////////////////////////////////
// Functions

function shuffleListsOrder() {
	for(var i=currQuestions.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		[currQuestions[i], currQuestions[j]] = [currQuestions[j], currQuestions[i]];
		[currAnswers[i], currAnswers[j]] = [currAnswers[j], currAnswers[i]];
		[currHints[i], currHints[j]] = [currHints[j], currHints[i]];
	}
}


//Initialize correct, currQuestions, currAnswers, and currHints
function initializeCurrLists(listIndex) {
  correct = [];
	currQuestions = [];
	currAnswers = [];
	currHints = [];
	//First we want to grab one question from another a previous list at random
	//  just to spice things up
	currQuestions = [...questionLists[listIndex]]; //spread operator shallow copy
	currAnswers = [...answerLists[listIndex]];
	currHints = [...hintLists[listIndex]];
	if (listIndex > 0) {
		//we have a previous list to select a question from
		var otherListIndex = Math.floor(Math.random() * listIndex);
		var otherQuestionIndex = Math.floor(Math.random() * questionLists[otherListIndex].length);
		currQuestions.push(questionLists[otherListIndex][otherQuestionIndex]);
		currAnswers.push(answerLists[otherListIndex][otherQuestionIndex]);
		currHints.push(hintLists[otherListIndex][otherQuestionIndex]);
	}
  for(var i=0; i<currQuestions.length; i++) {
		correct[i] = 0;
  }
}

function restart() {
  currIndex = 0;
  state = 0;
  initializeCurrLists(currList);
  failOnCurrent = 0;
	shuffleListsOrder();
  setProgress();
	promptElem.textContent = currQuestions[currIndex];
}


function sayIt(text) {
  var voice = voices[speechVoiceSelectorElem.options[voiceIndex].value];
  var utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.lang = voice.lang;
  utterance.rate = rate;
	window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
	return true;
}

function focusText() {
  guessElem.focus();
}

function advanceToNextQuestion() {
  var correctCount = 0;
  var startIndex = currIndex;
  var numQuestions = currQuestions.length;
  for(var i=1; i<=numQuestions; i++) {
		var testIndex = startIndex + i;
		if(testIndex >= numQuestions) {
	    testIndex -= numQuestions;
		}
		if(correct[testIndex]) {
	    correctCount++;
		} else {
	    currIndex = testIndex;
	    break;
		}
  }
  return (correctCount != numQuestions);
}

function checkAnswer() {
  var guess = guessElem.value.toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
  var answer = currAnswers[currIndex];
  if(!answer.localeCompare(guess)) {
		//Correct
		correct[currIndex] = !failOnCurrent;
		guessElem.value = "";
		if(!advanceToNextQuestion()) {
	    //Done!
			var celebrationWords = ["Yippee!", "Yee-haw!", "Woo-hoo!", "Hooray!", "Wahoo!"];
			sayIt(celebrationWords[Math.floor(Math.random()*celebrationWords.length)]);
			alert("You Got Them All!");
	    restart();
	    return;
		}
		sayIt("That's correct! . !");
		failOnCurrent = 0;
		setProgress();
		promptElem.textContent = currQuestions[currIndex];
  } else {
		//Incorrect
		failOnCurrent = 1;
		sayIt("Not quite. !");
		var hintText = "";
		if(currHints[currIndex] != null && currHints[currIndex] != "") {
			hintText = " (Hint: " + currHints[currIndex] + ")";
		}
		promptElem.textContent = currQuestions[currIndex] + hintText;
  }
}

function setProgress() {
  htmlContent = "<table>";
  for(var i=0; i<currQuestions.length; i++) {
		htmlContent += "<tr><td>";
		if(i == currIndex) {
	    htmlContent += "&rarr;";
		}
		htmlContent += "</td><td><span style=\"color:";
		if(correct[i]) {
	    htmlContent += "green";
		} else {
	    htmlContent += "black";
		}
		htmlContent += ";\">" + (i+1) + "</span></td></tr>"
  }
  htmlContent += "</table>";
  progressDivElem.innerHTML = htmlContent;
}

function showMe() {
  guessElem.value = currAnswers[currIndex];
	failOnCurrent = 1;
}

//Called by an onload on the body
function initialize() {
  //stop the screen from rubber banding around pointlessly
  document.ontouchmove = function(event) { event.preventDefault(); }

  //get references to DOM elements into global variables for faster access
  readyElem = document.getElementById('ready');
  settingsElem = document.getElementById("settings");
  speechVoiceSelectorElem = document.getElementById("speechVoiceSelector");
  speechRateSelectorElem = document.getElementById("speechRateSelector");
  mathListSelectorElem = document.getElementById("mathListSelector");
  settingsButtonElem = document.getElementById("settingsButton");
  okayButtonElem = document.getElementById("okButton");
  cancelButtonElem = document.getElementById("cancelButton");
  guessElem = document.getElementById("guess");
  advanceButtonElem = document.getElementById("advanceButton");
  progressDivElem = document.getElementById("progressDiv");
	promptElem = document.getElementById("promptSpan");

  //add event listeners
  //if("ontouchend" in window) {
  //	settingsButtonElem.addEventListener("touchend", showSettings, false);
  //okayButtonElem.addEventListener("touchend", settingsOK, false);
  //cancelButtonElem.addEventListener("touchend", settingsCancel, false);
  //} else {
  //	settingsButtonElem.addEventListener("mouseup", showSettings, false);
  //	okayButtonElem.addEventListener("mouseup", settingsOK, false);
  //  cancelButtonElem.addEventListener("mouseup", settingsCancel, false);
  //}

  state = 0;

  //now populate the speech speed selector
  for(var i=11; i<=30; i++) {
		var val = i/10.0;
		var el = document.createElement("option");
		if((val == 1.0 && isMac) ||
			 (val == 1.0 && !isMac)) {
	    el.textContent = val + " (Default)";
		} else {
	    el.textContent = val;
		}
		el.value = val;
		speechRateSelectorElem.appendChild(el);
  }

  //check storage for the speech rate
  if(typeof localStorage === 'object') {
		try {
	    if(!localStorage.storedSpeechRate) {
				localStorage.storedSpeechRate = rate;
	    }
	    rate = localStorage.storedSpeechRate;
		} catch (e) {
	    //silently ignore
		}
  }
  //loop through the speed selector drop down and select
  //  the appropriate one
  var numOptions = speechRateSelectorElem.options.length;
  for(var i=0; i<numOptions; i++) {
		if(speechRateSelectorElem.options[i].value == rate) {
	    speechRateSelectorElem.options[i].selected = true;
		}
  }

  numPositiveVoiceCheck = 0;
  initializedSpeech = 0;

  //getVoicesList returns nothing for a while as the browser
  //  loads the speech module, so we'll just keep calling
  //  it until we're confident it loaded the full list
  voiceGetterInterval = setInterval(function() {getVoicesList();}, 200);

  if(typeof localStorage === 'object') {
		try {
	    var storedIndex = localStorage.storedListIndex;
	    if(storedIndex >= 0 && storedIndex < mathListSelectorElem.options.length) {
				mathListSelectorElem.selectedIndex = storedIndex;
	    }
		} catch (e) {
	    //silently ignore
		}
  }

  settingsOK();

	restart();

  focusText();

}


//Show the panel where the user can change the settings
function showSettings() {
    settingsElem.style.visibility="visible";
}

function blurAll() {
    speechRateSelectorElem.blur();
    speechVoiceSelectorElem.blur();
    mathListSelectorElem.blur();
}

//Store settings when the user clicks okay
function settingsOK() {

  blurAll();

  //voice
  voiceIndex = speechVoiceSelectorElem.selectedIndex;
  if(voiceIndex >= 0) {
		//update the utterances
		var voice = voices[speechVoiceSelectorElem.options[voiceIndex].value];
		//store to localStorage
		if(typeof localStorage === 'object') {
	    try {
				localStorage.storedVoiceName = voice.name + " " + voice.lang;
	    } catch (e) {
				//silently ignore
	    }
		}
  }

  //rate
  var rateIndex = speechRateSelectorElem.selectedIndex;
  rate = speechRateSelectorElem.options[rateIndex].value;
  //store it to localStorage
  if(typeof localStorage === 'object') {
		try {
	    localStorage.storedSpeechRate = rate;
		} catch (e) {
	    //silently ignore
		}
  }

  //List selector
  var listIndex = mathListSelectorElem.selectedIndex;
  if(listIndex != currList) {
		currList = listIndex;
		restart();
  }
  if(typeof localStorage === 'object') {
		try {
	    localStorage.storedListIndex = listIndex;
		} catch(e) {
	    //silently ignore
		}
  }

  //Hide settings panel
  settingsElem.style.visibility="hidden";

}

//User clicked cancel -- replace settings with stored values
function settingsCancel() {

  blurAll();

  //reset the voices selector
  speechVoiceSelectorElem.options[voiceIndex].selected = true;

  //reset the speech rate
  var numOptions = speechRateSelectorElem.options.length;
  for(var i=0; i<numOptions; i++) {
		if(speechRateSelectorElem.options[i].value == rate) {
	    speechRateSelectorElem.options[i].selected = true;
		}
  }

	//reset the list selector
	mathListSelectorElem.selectedIndex = currList;

  //finally, hide the panel
  settingsElem.style.visibility="hidden";
}

//In theory, if the appcache file is updated, the app will find out
//  (assumedly it checks the server when there's an internet connection?)
//Then, the app can update itself accordingly
function updateSite(event) {
    window.applicationCache.swapCache();
}
window.applicationCache.addEventListener('updateready', updateSite, false);

//Check what voices are available
//This won't work when the page first loads, so we'll
//  callit several times with delays between, and wait until we have
//  a list that's full multiple times.
function getVoicesList() {
  voices = window.speechSynthesis.getVoices();
  if (voices.length !== 0) {
		numPositiveVoiceCheck++;
		if(numPositiveVoiceCheck < 2) {
	    //Make sure it's been populated for a while so that
	    //  we didn't accidentally get an incomplete list
	    return;
		}

		//populate the selector with the available voices
		var numVoices = voices.length;
		for(var i=0; i<numVoices; i++) {
	    //only include ones that don't require internet access
	    if(voices[i].localService) {
				var el = document.createElement("option");
				el.textContent = voices[i].name + " " + voices[i].lang;
				el.value = i;
				speechVoiceSelectorElem.appendChild(el);
	    }
		}
  } else {
		return;
  }

  //By default, select the first en-US entry
  var numSelector = speechVoiceSelector.options.length;
  for(var i=0; i<numSelector; i++) {
		if(voices[speechVoiceSelectorElem.options[i].value].lang == "en-US" ||
			 voices[speechVoiceSelectorElem.options[i].value].lang == "en_US") { //android uses underscore
	    speechVoiceSelectorElem.options[i].selected = true;
	    break;
		}
  }

  //now check local storage -- if we've already stored the voice, then select it.  Otherwise, store the default
  if(typeof localStorage === 'object') {
		try {
	    if(typeof localStorage.storedVoiceName == 'undefined') {
				localStorage.storedVoiceName = voices[speechVoiceSelector.options[speechVoiceSelectorElem.selectedIndex].value].name + " " + voices[speechVoiceSelector.options[selectV.selectedIndex].value].lang;;
	    } else {
				var targetName = localStorage.storedVoiceName;
				for(var i=0; i<numSelector; i++) {
					if(voices[speechVoiceSelector.options[i].value].name + " " + voices[speechVoiceSelector.options[i].value].lang == targetName) {
						speechVoiceSelector.options[i].selected = true;;
						break;
					}
				}
	    }
		} catch (e) {
	    //silently ignore
		}
  }
  voiceIndex = speechVoiceSelector.selectedIndex;

  clearInterval(voiceGetterInterval);
}

// Functions
///////////////////////////////////////////


