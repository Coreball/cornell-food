<script lang="ts">
  import dayjs from 'dayjs'
  import LocalizedFormat from 'dayjs/plugin/localizedFormat'
  import data from './data.json'

  dayjs.extend(LocalizedFormat)

  let semesterIndex = -1
  let dataIndex = 0
  $: current = semesterIndex !== -1 ? data[semesterIndex].data[dataIndex] : null

  let hovering = false
</script>

<main>
  <button
    class="arrow"
    id="previous"
    hidden={semesterIndex === -1}
    on:click={() => {
      if (dataIndex === 0) {
        semesterIndex--
        dataIndex = semesterIndex !== -1 ? data[semesterIndex].data.length - 1 : 0
      } else {
        dataIndex--
      }
    }}
  >
    <svg width={50} height={200}>
      <path d="M 50 0 L 2 100 L 50 200" />
    </svg>
    <p>Previous</p>
  </button>
  <div id="info">
    {#if current === null}
      <div id="intro">
        <h1>Cornell Dining in the Pandemic</h1>
        <p>As experienced through Changyuan Lin</p>
      </div>
    {:else}
      <img src="/images/{current.filename}" alt="Image {current.filename}" />
      <div class="separator" />
      <div id="description">
        <p class="date">{dayjs(current.timestamp).format('LLL')}</p>
        <p>{current.description ?? ''}</p>
      </div>
    {/if}
  </div>
  <button
    class="arrow"
    id="next"
    hidden={semesterIndex === data.length - 1 && dataIndex === data[semesterIndex].data.length - 1}
    on:click={() => {
      if (semesterIndex !== -1) {
        if (dataIndex === data[semesterIndex].data.length - 1) {
          semesterIndex++
          dataIndex = 0
        } else {
          dataIndex++
        }
      } else {
        semesterIndex = 0
      }
    }}
  >
    <svg width={50} height={200}>
      <path d="M 0 0 L 48 100 L 0 200" />
    </svg>
    <p>Next</p>
  </button>
</main>

<nav>
  {#each data as semester, si}
    <div class="sem-group">
      <p>{semester.semester}</p>
      <div class="entries">
        {#each semester.data as entry, di}
          <!-- svelte-ignore a11y-mouse-events-have-key-events -->
          <button
            class:selected={!hovering && semesterIndex === si && dataIndex === di}
            on:mouseover={() => (hovering = true)}
            on:mouseleave={() => (hovering = false)}
            on:click={() => {
              semesterIndex = si
              dataIndex = di
            }}><p>{entry.timestamp}</p></button
          >
        {/each}
      </div>
    </div>
  {/each}
</nav>

<style>
  main {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
  }
  img {
    width: 750px;
    height: 750px;
    object-fit: contain;
  }
  #info {
    display: flex;
    gap: 40px;
  }
  .separator {
    width: 4px;
    height: 750px;
    background-color: #ffffff;
  }
  #description {
    width: 500px;
    margin-top: 80px;
  }
  .date {
    font-weight: bold;
  }
  #previous {
    position: absolute;
    left: 30px;
  }
  #next {
    position: absolute;
    right: 30px;
  }
  .arrow {
    background-color: transparent;
    border: none;
    width: 80px;
  }
  .arrow svg path {
    fill: transparent;
    stroke: #666666;
    stroke-width: 4px;
    stroke-linecap: square;
    stroke-linejoin: miter;
    transition: stroke 100ms;
  }
  .arrow:hover > svg path {
    stroke: #ffffff;
  }
  .arrow p {
    color: #ffffff;
    font-size: 1rem;
  }

  nav {
    display: flex;
    overflow-x: auto;
    padding: 30px 300px;
    flex-shrink: 0;
  }
  .sem-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-left: 4px solid white;
  }
  .sem-group:last-child {
    border-right: 4px solid white;
  }
  .sem-group p {
    font-size: 12px;
  }
  .entries {
    display: flex;
  }
  .entries button {
    position: relative;
    width: 8px;
    height: 30px;
    padding: 0;
    border: none;
    background-color: #666666;
  }
  .entries button p {
    position: absolute;
    top: 20px;
    color: #ffffff;
    visibility: hidden;
  }
  .entries button:hover,
  .entries button.selected {
    background-color: #ffffff;
  }
  .entries button:hover > p {
    visibility: visible;
  }
</style>
