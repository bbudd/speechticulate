'use strict';

var slice = Array.prototype.slice;

var app = {

  config : {
    next: 'sendClick',
    back: 'sendClick'
  },

  methods: {
    sendClick: function(transcript) {
      var button = document.querySelector('[data-voice="' + transcript + '"]');
      if (button) {
        console.log(transcript);
        var evt = document.createEvent('MouseEvents');
        evt.initEvent('click', true, false);
        button.dispatchEvent(evt);
        app.flashRecognized();
      }
    }
  },

  onResult : function(evt) {
    var result, transcript,
        results = slice.call(evt.results, evt.resultIndex);

    results.forEach(function(result) {
      if (!result.isFinal) { return; }

      var transcript = result[0].transcript.trim().toLowerCase(),
          method = app.config[transcript];

      if (method != null) {
        app.methods[method](transcript);
      }

    });
  },

  flashRecognized: function() {
    document.body.style.backgroundColor = 'red';
    window.requestAnimationFrame(function() {
      document.body.style.transition = "background-color 0.5s ease";
      document.body.style.backgroundColor = '';
    });
  }

}

var Voice = function() {
  this.recognition = new webkitSpeechRecognition();
  this.recognition.continuous = true;
  this.recognition.interimResults = false;
  this.recognition.lang = 'en-US';
  this.listeners = {};
}

var voiceProto = {

  addListener : function(evt, callback) {
    this.listeners[evt] = this.listeners[evt] || [];
    this.listeners[evt].push(callback);
    this.recognition['on' + evt] = callback;
    return this;
  },

  removeListener : function(evt, callback) {
    var indexOf;
    if (this.listeners[evt]) {
      if (!callback) {
        this.listeners[evt].forEach(function(cb) {
          this.recognition.removeEventListener(evt, cb);
        });
        this.listeners[evt] = null;
      } else if (callback && (indexOf = this.listeners[evt].indexOf(callback))) {
        this.listeners[evt].splice(indexOf, 1);
        this.recognition.removeEventListener(evt, callback);
      }
    }
    return this;
  },

  start : function() {
    this.recognition.start();
    return this;
  },

  stop : function() {
    this.recognition.stop();
    return this;
  }

}

Voice.prototype = voiceProto;

app.voice = new Voice();

app.voice.start().addListener('result', app.onResult);
