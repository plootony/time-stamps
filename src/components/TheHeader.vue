<template>
  <header class="header">

    <span class="header__welcome">Welcome, Anton! 👋</span>

    <div class="header__controls">
      <div class="search">
        <button class="search__btn">
          <svg class="icon icon--search icon--lg">
            <use xlink:href="@/assets/icons/sprite.svg#search"></use>
          </svg>
        </button>

        <input class="search__input" type="text" placeholder="Поиск">
      </div>

      <div class="dropdown">
        <button class="dropdown__btn">
          <svg class="icon icon--bell icon--lg">
            <use xlink:href="@/assets/icons/sprite.svg#bell"></use>
          </svg>
        </button>
      </div>
      
      <div class="dropdown">
        <button class="dropdown__btn">
          <svg class="icon icon--settings icon--lg">
            <use xlink:href="@/assets/icons/sprite.svg#settings"></use>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>