(function() {

  return {
    events: {
      'app.created': 'init',
      '*.changed':'handleText'
    },

    requests: {
      renderMarkdown: function(text) {
        return {
          url: '/api/v2/format/markdown.json',
          dataType: 'JSON',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            "text": text
          })
        };
      }
    },

    markdownBlock: new RegExp("{{markdown}}([\\W\\w]*){{/markdown}}"),
    commentSplit: new RegExp("([\\W\\w]*)({{markdown}}([\\W\\w]*){{/markdown}})([\\W\\w]*)"),
    cleanupBr: new RegExp("<br>", "g"),

    init: function() {

    },

    handleText: function(evt) {
      console.log(evt);
      if(evt.propertyName == "comment.text") {
        var commentText = evt.newValue;
        if(this.markdownBlock.test(commentText)) {
          var innerText = this.commentSplit.exec(this.ticket().comment().text());
          var markdown = innerText[3];
          var before   = innerText[1];
          var after    = innerText[4];
          markdown = markdown.replace(this.cleanupBr, "\n");
          this.ajax("renderMarkdown", markdown).done(function(data) {
            var html = data.html;
            var comment = before + html + after;
            this.ticket().comment().text(comment);
          });
        }
      }

    }
  };

}());
