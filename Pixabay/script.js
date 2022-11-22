const url = 'https://pixabay.com/api/?key=30690173-fbce03636c089af445ecfd2be';

let query = '';
let queryRadioBtn = '';
let perPage = 16;
let pageCounter = 1;
let pageNumber = 1;
let totalPages;


const form = document.forms.namedItem('queryLine');

form.addEventListener('submit', e => {
    e.preventDefault();
    sendRequest('', false)
    pageCounter = 1;
});

// take radio buttons with different values
const radioBtn = document.querySelectorAll("input[name='check']");
radioBtn.forEach((radio, i) => {
    radio.addEventListener('change', e => {
        queryRadioBtn = e.target.value;
        if (queryRadioBtn == 'popuplar') {
            sendRequest('', false)
            pageCounter = 1;
        } else {
            sendRequest('', true)
            pageCounter = 1;
        }
        console.log(queryRadioBtn);
    });
});


// take value from input field 
const queryField = document.querySelector('#queryField');
queryField.addEventListener('input', (e) => {
    query = e.target.value;
    // console.log(query);
});

// pagination
// const paginationWrapper = document.querySelector('.pagination__wrapper');
const paginationWrapper = document.createElement('div');
paginationWrapper.classList.add('pagination__wrapper')
paginationWrapper.style.width = '400px';
paginationWrapper.style.display = 'flex';
paginationWrapper.style.justifyContent = 'space-evenly';
paginationWrapper.style.margin = '20px auto 0';

document.body.appendChild(paginationWrapper);

const paginationControl = (type) => {
    if (type == 'fwd') {
        pageCounter += 1;
    };
    if (type == 'back') {
        pageCounter -= 1;
    };

    console.log(pageCounter);

    console.log("Per page > " + perPage, 'Total page > ' + totalPages);
    sendRequest(pageCounter, true);

};


const sendRequest = (pageNumber, initialLoad) => {

    // local storage
    if (!initialLoad) localStorage.setItem('lastRequest', query);

    fetch(url + `&q=${localStorage.getItem('lastRequest')}&page=${pageNumber}&per_page=${perPage}&order=${queryRadioBtn}`)
        .then(response => response.json())
        .then(data => {

            const contentOnbj = data.hits;

            totalPages = Math.ceil(data.total / perPage);
            console.log(totalPages);

            paginationWrapper.innerHTML = `
            ${pageCounter <= 1 ? `<div class="pagination__list__item previous"></div>` : `<div onclick="paginationControl('back')" class="pagination__list__item previous">&larr;</div>`}
            <div class="pagination__list__number">${pageCounter <= 1 ? '' : pageCounter - 1}</div>
            <div class="pagination__list__number" style="background: rgba(182, 222, 235, .2); border-radius: 10px; color: white;">${pageCounter}</div>
            ${pageCounter == totalPages ? `<div class="pagination__list__number"></div>` : `<div class="pagination__list__number">${pageCounter + 1}</div>`}
            ${pageCounter == totalPages ? `<div class="pagination__list__item next"></div>` : `<div onclick="paginationControl('fwd')" class="pagination__list__item next">&rarr;</div>`}
            `;

            const containerElement = document.querySelector('.container__element');
            containerElement.innerHTML = '';

            // take any element
            contentOnbj.forEach(el => {
                // console.log(el);

                // creating block and add photo to him 
                const elementPhoto = document.createElement('div');
                elementPhoto.classList.add('element__photo');
                containerElement.appendChild(elementPhoto);
                // elementPhoto.style.backgroundImage = `url(${src})`;

                // create spinner 
                const spinner = document.createElement('span');
                spinner.classList.add('loader');
                elementPhoto.appendChild(spinner);

                //create image object and when image load remove spinner
                let src = el.webformatURL;
                let image = new Image();

                image.addEventListener('load', () => {

                    elementPhoto.style.backgroundImage = `url(${src})`;
                    spinner.remove();
                });
                image.src = src;


                // pagination logic
                // if (initialLoad) {
                //     paginationControl()
                // };

                // click on photo and open large photo
                elementPhoto.addEventListener('click', (e) => {
                    e.preventDefault();

                    // creating block for fullscreen image
                    const fullScreen = document.createElement('div');
                    fullScreen.classList.add('fullscreen');
                    fullScreen.classList.add('fullscreen__active');
                    fullScreen.innerHTML = `<img src="${el.largeImageURL}">`


                    // creating popup
                    const popup = document.createElement('div');
                    const close = document.createElement('div');

                    popup.classList.add('popup');
                    close.classList.add('close');

                    close.innerHTML = innerHTML = `
                        <svg width="0" height="0" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <path fill="#b6deeb" d="M16 0l-1 0.010-7 6.99-7-6.99-1-0.010v1l7 7-7 7v1h1l7-7 7 7h1v-1l-7-7 7-7v-1z"></path>
                        </svg>
                    `;
                    
                    document.body.appendChild(popup);
                    popup.appendChild(fullScreen);
                    popup.appendChild(close);
                    console.log(close);

                    const svgImage = document.querySelector('svg');
                    const pathImage = document.querySelector('path');
                    console.log(svgImage);
                    // remove popup with fullcreen photo
                    popup.addEventListener('click', (e) => {
                        if (e.target == popup || e.target == fullScreen || e.target == close || e.target == svgImage || e.target == pathImage) {
                            popup.remove();
                            fullScreen.remove()
                            close.remove();
                            svgImage.remove();
                            pathImage.remove()
                            console.log(e.target);
                        };
                    });
                })
            });

        })
        .catch(err => console.log('Error >', err))
    // containerElement
};

window.addEventListener('load', () => {
    query = localStorage.getItem('lastRequest');
    sendRequest('', true);
});


// if(initialLoad) {
//     window.addEventListener('load', () => {
//         sendRequest('', true);
//         // query = localStorage.getItem('lastRequest')
//     });
// } else{
//     window.addEventListener('load', () => {
//         sendRequest('', true);
//         query = localStorage.getItem('lastRequest')
//     });
// }