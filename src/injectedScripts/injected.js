(function () {
  const XHR = XMLHttpRequest.prototype;

  const open = XHR.open;
  const send = XHR.send;
  const setRequestHeader = XHR.setRequestHeader;

  XHR.open = function (method, url) {
    this._method = method;
    this._url = url;
    this._requestHeaders = {};
    this._startTime = new Date().toISOString();

    return open.apply(this, arguments);
  };

  XHR.setRequestHeader = function (header, value) {
    this._requestHeaders[header] = value;
    return setRequestHeader.apply(this, arguments);
  };

  XHR.send = function (postData) {
    this.addEventListener('load', function () {
      const endTime = new Date().toISOString();

      const myUrl = this._url ? this._url.toLowerCase() : this._url;
      if (myUrl) {
        if (postData) {
          if (typeof postData === 'string') {
            try {
              // here you get the REQUEST HEADERS, in JSON format, so you can also use JSON.parse
              this._requestHeaders = postData;
            } catch (err) {
              console.log(
                'Request Header JSON decode failed, transfer_encoding field could be base64',
              );
              console.log(err);
            }
          } else if (
            typeof postData === 'object' ||
            typeof postData === 'array' ||
            typeof postData === 'number' ||
            typeof postData === 'boolean'
          ) {
            // do something if you need
          }
        }

        // here you get the RESPONSE HEADERS
        const responseHeaders = this.getAllResponseHeaders();

        if (
          (this.responseType === 'text' || this.responseType === '') &&
          this.responseText
        ) {
          // responseText is string or null
          try {
            // here you get RESPONSE TEXT (BODY), in JSON format, so you can use JSON.parse
            const arr = this.responseText;

            // printing url, request headers, response headers, response body, to console

            // console.log('listen: ', this._url);
            // console.log('listen: ', this._requestHeaders);
            if (this._requestHeaders['x-csrf-token']) {
              localStorage.setItem(
                'requestHeaders',
                JSON.stringify(this._requestHeaders),
              );
            }
            // console.log('listen: ', responseHeaders);
            // console.log('listen: ', arr);
            try {
              if (this._url.indexOf('DeleteTweet') > -1) {
                var event = new CustomEvent('DeleteBinding', {
                  detail: {
                    platform: 'Twitter',
                    contentId: JSON.parse(
                      JSON.parse(this._requestHeaders).variables,
                    ).tweet_id,
                  },
                });
                document.dispatchEvent(event);
              }
              if (arr.indexOf('move_to_trash_story') > -1) {
                var event = new CustomEvent('DeleteBinding', {
                  platform: 'Facebook',
                  detail: {
                    contentId:
                      JSON.parse(arr).data.move_to_trash_story.trashed_story_id,
                  },
                });
                document.dispatchEvent(event);
              }
              if (arr.indexOf('Binding with Soda') > -1) {
                const contentId = JSON.parse(arr).data.story_create.story.id;
                var event = new CustomEvent('PostBinding', {
                  platform: 'Facebook',
                  detail: {
                    contentId,
                  },
                });
                document.dispatchEvent(event);
              }
            } catch (err) {
              console.log(err);
            }
          } catch (err) {
            console.log('Error in responseType try catch');
            console.log(err);
          }
        }
      }
    });

    return send.apply(this, arguments);
  };
})(XMLHttpRequest);
