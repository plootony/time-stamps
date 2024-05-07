<template>
  <aside class="sidebar">
    <a
        href="/"
        class="router-link-active router-link-exact-active logo">

      <img
          src="@/assets/images/logo.svg"
          width="44"
          height="45"
          alt="logo"
      >
    </a>

    <nav class="nav">
      <a
          href="/"
          class="router-link-active router-link-exact-active nav__item"
      >
        <svg class="icon icon--home icon--lg">
          <use xlink:href="@/assets/icons/sprite.svg#home"></use>
        </svg>
      </a>

      <a
          href="/courses"
          class="nav__item"
      >
        <svg class="icon icon--calendar icon--lg">
          <use xlink:href="@/assets/icons/sprite.svg#calendar"></use>
        </svg>
      </a>

      <a
          href="/courses"
          class="nav__item">
        <svg class="icon icon--chart icon--lg"
        >
          <use xlink:href="@/assets/icons/sprite.svg#chart"></use>
        </svg>
      </a>
      <a
          href="/courses"
          class="nav__item"
      >
        <svg class="icon icon--chat icon--lg">
          <use xlink:href="@/assets/icons/sprite.svg#chat"></use>
        </svg>
      </a>
      <a
          href="/courses"
          class="nav__item"
      >
        <svg class="icon icon--folder icon--lg">
          <use xlink:href="@/assets/icons/sprite.svg#folder"></use>
        </svg>
      </a></nav>
  </aside>
</template>