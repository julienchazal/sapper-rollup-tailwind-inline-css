<script context="module">
    //************** FETCH API ******************//
    function status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response)
        } else {
            return Promise.reject(new Error(response.statusText))
        }
    }

    function json(response) {
        return response.json()
    }

    function text(response) {
        return response.text()
    }

    export function utilsFetch (url, dataType, callback, submitBtn, countdownEL) {
        console.log('ici');
        submitBtn && disableFetchBtn(submitBtn);

        fetch(url, {credentials: 'same-origin'})
                .then(status)
                .then(dataType === 'text' ? text : json)
                .then(data => {
                    if (countdownEL) {
                        callback(data, false, countdownEL);
                    } else {
                        callback(data);
                    }
                    submitBtn && enableFetchBtn(submitBtn);
                })
                .catch(err => {
                    console.log(err);
                    callback(err, true, countdownEL);
                    submitBtn && enableFetchBtn(submitBtn);
                });
    }

    export function utilsFetchPost (url, json, callback) {
        fetch(url, {
            credentials: 'same-origin',
            method: 'post',
            headers: {
                'X-Authorization': '96aad9d50390e92334568124b3db9aa1',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        })
                .then(status)
                .then(text)
                .then(data => callback(data))
                .catch(err => {
                    console.log(err);
                    callback(err, true)
                });
    }

    export function utilsFetchPostForm (url, formData, callback, submitBtn) {
        submitBtn && disableFetchBtn(submitBtn);
        fetch(url, {
            credentials: 'same-origin',
            method: 'post',
            body: formData
        })
                .then(status)
                .then(text)
                .then(data => {
                    callback(data);
                    submitBtn && enableFetchBtn(submitBtn);
                })
                .catch(err => {
                    console.log(err);
                    callback(err, true);
                    submitBtn && enableFetchBtn(submitBtn);
                });
    }

    export function disableElement(el) {
        el.setAttribute('disabled','disabled');
    }

    export function enableElement(el) {
        el.removeAttribute('disabled');
    }

    export function disableFetchBtn (btn) {
        disableElement(btn);
        btn.classList.add('fetching');
        btn.insertAdjacentHTML('beforeend','<div class="progress-circular"></div>');
    }

    export function enableFetchBtn (btn) {
        enableElement(btn);
        btn.classList.remove('fetching');
        btn.removeChild(btn.querySelector('.progress-circular'));
    }

    export function createCookie(name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    export function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
</script>
