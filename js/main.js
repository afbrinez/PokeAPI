const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const URL = "https://pokeapi.co/api/v2/pokemon/";
const TOTAL = 150;

async function cargarTodosLosPokemon() {
  const promesas = [];

  for (let i = 1; i <= TOTAL; i++) {
    promesas.push(fetch(URL + i).then(res => res.json()));
  }

  const resultados = await Promise.all(promesas);

  // Ordenar por ID (por si acaso)
  resultados.sort((a, b) => a.id - b.id);

  // Mostrar todos los Pokémon
  resultados.forEach(poke => mostrarPokemon(poke));
}

cargarTodosLosPokemon();

function mostrarPokemon(poke) {
  let tipos = poke.types.map(type => `<p class="${type.type.name} tipo">${type.type.name}</p>`).join('');

  let pokeId = poke.id.toString().padStart(3, '0');

  const div = document.createElement('div');
  div.classList.add('pokemon');
  div.innerHTML = `
    <p class="pokemon-id-back">#${pokeId}</p>
    <div class="pokemon-imagen">
      <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
    </div>
    <div class="pokemon-info">
      <div class="nombre-contenedor">
        <p class="pokemon-id">#${pokeId}</p>
        <h2 class="pokemon-nombre">${poke.name}</h2>
      </div>
      <div class="pokemon-tipos">
        ${tipos}
      </div>
      <div class="pokemon-stats">
        <p class="stat">${poke.height}m</p>
        <p class="stat">${poke.weight}kg</p>
      </div>
    </div>
  `;

  listaPokemon.append(div);
}

// Filtro por tipo
botonesHeader.forEach(boton => boton.addEventListener("click", async (event) => {
  const botonId = event.currentTarget.id;
  listaPokemon.innerHTML = "";

  console.log(event)

  const promesas = [];
  for (let i = 1; i <= TOTAL; i++) {
    promesas.push(fetch(URL + i).then(res => res.json()));
  }

  const resultados = await Promise.all(promesas);
  resultados.sort((a, b) => a.id - b.id);

  resultados.forEach(poke => {
    if (botonId === "ver-todos") {
      mostrarPokemon(poke);
    } else {
      const tipos = poke.types.map(type => type.type.name);
      if (tipos.includes(botonId)) {
        mostrarPokemon(poke);
      }
    }
  });

  toggleBTN(event.target)
}));

function toggleBTN(btnSelected) {
  console.log(btnSelected)
  
  botonesHeader.forEach((boton) => {
    boton.classList.remove('selected');
  })

  btnSelected.classList.add('selected')
}



function openPopupFromCard(cardElement) {
  const popup = document.getElementById('pokemon-popup');
  const popupContent = popup.querySelector('.popup-content');

  const rect = cardElement.getBoundingClientRect();

  // Posición inicial (la card)
  popupContent.style.transform = `
    translate(${rect.left + rect.width / 2}px, ${rect.top + rect.height / 2}px)
    scale(0.1)
  `;
  popupContent.style.opacity = '0';

  // Mostrar popup
  popup.classList.add('show');

  // Forzar repaint para activar transición (hack)
  void popupContent.offsetWidth;

  // Transición a centro
  popupContent.style.transform = `translate(0, 0) scale(1)`;
  popupContent.style.opacity = '1';
}

function closePopup() {
  const popup = document.getElementById('pokemon-popup');
  popup.classList.remove('show');
}