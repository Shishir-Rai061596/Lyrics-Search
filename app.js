const FORM = document.querySelector('#form');
const SEARCH = document.querySelector('#search');
const BUTTON = document.querySelector('button');
const RESULT = document.querySelector('#result');
const MORE = document.querySelector('#more');

const APIURL = 'https://api.lyrics.ovh';


const getMoreSongs = async url => {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();
    showData(data)
}

const showData = data => {
    RESULT.innerHTML = `
    <ul class="songs">
    ${data.data.map(song => `<li>
         <span><strong>${song.artist.name}-${song.title}</strong></span>
     <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button></li>`).join('')}</ul>`;

    if (data.prev || data.next) {
        MORE.innerHTML = `
         ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
         ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}`
    } else {
        MORE.innerHTML = ''
    }
}

const searchSongs = async input => {
    const res = await fetch(`${APIURL}/suggest/${input}`);
    const data = await res.json();
    showData(data)
}

const handleGetSongs = e => {
    e.preventDefault();
    const input = SEARCH.value.trim();
    if (!input) {
        alert('Please type in a search term')
    } else {
        SEARCH.value = '';
        searchSongs(input)
    }

}
const getLyrics = async (artist, songTitle) => {
    const res = await fetch(`${APIURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')
    RESULT.innerHTML = `
    <h2><strong>${artist}</strong>-${songTitle}</h2>
   <span> ${lyrics}</span>`
    MORE.innerHTML = '';
}

const handleGetLyrics = e => {
    const clickedEL = e.target;
    if (clickedEL.classList.contains("btn")) {
        const artist = clickedEL.getAttribute('data-artist');
        const songTitle = clickedEL.getAttribute('data-songtitle');
        getLyrics(artist, songTitle)
    }
}

FORM.addEventListener('submit', handleGetSongs)
RESULT.addEventListener('click', handleGetLyrics)
