'use strict';

var slice = Array.prototype.slice;

var app = {

  config : {
    next: 'sendClick',
    back: 'sendClick'
  },

  getEl : function(item) {
    var selector = ['[data-voice=', item, ']' ].join('"');
    return document.querySelector(selector);
  },

  directMethods: {
    sendClick: function(transcript) {
      var el = app.getEl(transcript);
      if (el) {
        console.log(transcript);
        var evt = document.createEvent('MouseEvents');
        evt.initEvent('click', true, false);
        el.dispatchEvent(evt);
        app.flashRecognized();
      }
    },
    focusObject: function(transcript) {
      var el = app.getEl(transcript);
      el.focus();
      app.flashRecognized();
    }
  },

  onResult : function(evt, callback) {
    var result, transcript,
        results = slice.call(evt.results, evt.resultIndex);

    results.forEach(function(result) {
      if (!result.isFinal) { return; }
      var transcript = result[0].transcript.trim().toLowerCase();
      callback(transcript);
    });
  },

  onMessageResult : function(evt) {
    var callback = function(transcript) {
      window.postMessage({ type: 'voiceExtension', text: transcript}, '*');
    };
    app.onResult(evt, callback);
  },

  onDirectResult : function(evt) {
    var callback = function(transcript) {
      var method = app.config[transcript];

      if (method != null) {
        app.directMethods[method](transcript);
      }
    }
    app.onResult(evt, callback);
  },

  flashRecognized: function() {
    document.body.style.backgroundColor = 'red';
    setTimeout(function() {
      document.body.style.transition = "background-color 0.5s ease";
      document.body.style.backgroundColor = '';
    }, 42);
  }

}

var Voice = function() {
  this.recognition = new webkitSpeechRecognition();
  this.recognition.continuous = true;
  this.recognition.interimResults = false;
  this.recognition.lang = 'en-US';
  this.listeners = {};
};

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

};

Voice.prototype = voiceProto;

(function() {
  var method;
  if (document.querySelector('.voice-enabled')) {
    app.voice = new Voice();
    method = (document.querySelector('.voice-message') == null) ?
      'onDirectResult' : 'onMessageResult';
    app.voice.start().addListener('result', app[method]);
  }
}());

