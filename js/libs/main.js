'use strict'

const API_KEY = '29bb47b7552ec502eb87cebfbc77f766';
const API_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

$(document).ready(function () {

    // events
    $('.search__btn').click(() => {
        getMovie()
    })

    $('.search__field').keypress((e) => {
        if (e.keyCode === 13)
            getMovie()
    })

    // Functions
    async function getMovie() {
        let query = $('.search__field').val()

        $('body').addClass('loading')

        if (query !== '') {
            $('.movie').remove()

            let url = `${API_URL}/search/movie?api_key=${API_KEY}&query=${query}`
            try {
                let response = await fetch(url)
                let res = await response.json()
                console.log(res)

                if (res.results.length === 0) {
                    alert('No movies found')
                } else {
                    res.results.forEach((movie) => {
                        if (movie.poster_path !== null)
                            $('.movies').append(drawMovie(movie))
                    })
                }
                $('body').removeClass('loading')
            } catch (e) {
                alert('Error!!!')
            }
            //     $('.movie').remove()

            //     $.ajax({
            //         url: `${API_URL}/search/movie`,
            //         type: 'GET',
            //         dataType: 'json',
            //         data: {
            //             api_key: API_KEY,
            //             query: query
            //         },
            //     }).then((res) => {
            //         if (res.results.length === 0) {
            //             alert('No movies found')
            //         } else {
            //             res.results.forEach((movie) => {
            //                 if (movie.poster_path !== null)
            //                     $('.movies').append(drawMovie(movie))
            //             })
            //         }
            //         $('body').removeClass('loading')
            //     }).catch((e) => console.log(e))
        }
        if (query == '') {
            alert('Please, enter movie.')
            $('body').removeClass('loading')
        }
    }

    function drawMovie(movie) {
        let movieDOM = $(`<div class="movie">
                            <img src="${IMG_URL + movie.poster_path}" alt="">
                            <h2 class="movie__title">${movie.title}</h2>
                            <div class="movie__info">
                                <h3><b>Release date: </b>${movie.release_date}</h3>
                                <h3><b>Rating: </b>${movie.vote_average}</h3>
                                <p>${movie.overview}</p>
                            </div>
                        </div>`)
        let clickMovieinfo = movieDOM.find('.movie__info')

        clickMovieinfo.click(() => {
            getReviews(movie.id, movie.title)
        })

        return movieDOM
    }

    async function getReviews(id, title) {
        let url = `${API_URL}/movie/${id}/reviews?api_key=${API_KEY}`

        try {
            let response = await fetch(url)
            let result = await response.json()
            console.log(result)

            result.results.forEach(function (reviews) {
                $('.reviews').append(drawWindow(reviews))
            })

            $('.window').css('display', 'block')
            $('.window-overlay').css('display', 'block')

            if (result.results.length === 0) {
                alert('Sorry, review is not found.')
                $('.window-overlay').css("display", "none")
                $('.window').css("display", "none")
            }

            $('.titleMovie').html(title)

            $('.reviews__close').click(() => {
                $('.reviews__title').remove()
                $('.reviews__content').remove()
                $('.window-overlay').css("display", "none")
                $('.window').css("display", "none")
            })

            $('.window-overlay').click(() => {
                $('.reviews__title').remove()
                $('.reviews__content').remove()
                $('.window-overlay').css("display", "none")
                $('.window').css("display", "none")
            })

        } catch (e) {
            alert('Error!!!')
        }
    }

    function drawWindow(reviews) {
        let reviewsDOM = `
                        <h1 class="reviews__title">${reviews.author}</h1>
                        <p class="reviews__content">${reviews.content}</p>
                        `
        return reviewsDOM
    }
})

// let value = fetch('http://localhost:3000')
//     .then(value => {
//         showValue(value)
//         console.log('Мы получили данные')
//     })
//     .catch(err => {
//         console.log('Наша ошибка', err)
//     })
// showValue(value)
// console.log('Выполнение кода')