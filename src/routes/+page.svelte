<script lang="ts">
  import { Pane } from 'tweakpane';
  import { browser } from '$app/environment';
  import { Directions, Vacuum } from "$lib/models/vacuum";

  let areaData = {
    grid: 400,
    box: 6,
    x: 0,
    y: 0
  }
  $: boxSize = areaData.grid / areaData.box;
  $: background = `min-width: ${areaData.grid}px; min-height: ${areaData.grid}px; background-size: 100% ${boxSize}px, ${boxSize}px, 100%;`;

  let instructions = "";
  let vacuum = new Vacuum(areaData.x, areaData.y, Directions.South, areaData.box)
  let result = vacuum.getCurrentPosition();
  let showResult: boolean = false;
  
  $: x = result.x * boxSize;
  $: y = result.y * boxSize;
  $: rotation = result.rotation;


  let handleInstructions = (event: any) => {
    const invalidChars = /[^ADGadg]/gi;
    const input = event?.target.value;
    event.target.value = input.replace(invalidChars, "");
  }

  let start = () => {
    let i = 0;
    let timer = setInterval(() => {
      if (i < instructions.length) {
        vacuum.processInstruction(instructions[i].toUpperCase());
        result = vacuum.getCurrentPosition();
        i++;
      } else {
        showResult = true;
        instructions = "";
        clearInterval(timer);
      }
    }, 300);
  }

  let reset = () => {
    areaData.x = 0;
    areaData.y = 0;
    vacuum = new Vacuum(areaData.x, areaData.y, Directions.South, areaData.box);
    result = vacuum.getCurrentPosition();
    showResult = false;
  }

  let move = (instruction: string) => {
    vacuum.processInstruction(instruction);
    result = vacuum.getCurrentPosition();
  }

  if (browser) {
    const pane = new Pane({ title: 'Area', expanded: true});
    pane.addInput(areaData, 'grid', { format: (v) => v.toFixed(0), min: 300, max: 800 }).on('change', ({ value }) => {
      areaData.grid = value;
    });
    pane.addInput(areaData, 'box', { format: (v) => v.toFixed(0), min: 4, max: 20, step: 1 }).on('change', ({ value }) => { 
      areaData.box = value; 
      vacuum.area = value;
    });
  }
</script>

<header>
  <h1>Hello Vacuum!</h1>
</header>
<main>
  <section class="grid" style={background}>
    <div class="vacuum" style={`width: ${boxSize}px; height: ${boxSize}px; left: ${x}px; top: ${y}px; transform: rotate(${rotation}deg);`}>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke="rgb(30, 48, 80)" stroke-width="4" fill="rgb(30, 48, 80)" />
        <line x1="40" y1="50" x2="60" y2="50" stroke="white" fill="none" stroke-width="4" stroke-linecap="round"/>
        <line x1="30" y1="60" x2="70" y2="60" stroke="white" fill="none" stroke-width="4" stroke-linecap="round"/>
        <line x1="40" y1="70" x2="60" y2="70" stroke="white" fill="none" stroke-width="4" stroke-linecap="round"/>
        <path d="M 25 40 C 40 20 60 20 75 40" stroke="white" fill="none" stroke-width="4" stroke-linecap="round"/>
     </svg>
    </div>
  </section>
  <div class="menu">
    <h2>Send a sequence of instructions</h2>
    <form on:submit|preventDefault={start}>
      <input type="text" pattern="[ADGadg]+" bind:value={instructions} on:input={handleInstructions} placeholder="A D or G">
      <button type="submit">Submit</button>
    </form>
    {#if showResult}
      <p class="result">{result.message}</p>
    {/if}
    <div class="controls-container">
      <button on:click={reset}>Reset</button>
      <button on:click={() => {move('A')}}>A</button>
      <button on:click={() => {move('D')}}>D</button>
      <button on:click={() => {move('G')}}>G</button>
    </div>
  </div>
</main>

<style lang="scss">
  main {
    padding: 60px 20px 20px 20px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
  }

  section.grid {
    position: relative;
    border: 3px solid black;
    background-image: 
      linear-gradient(black 0px, black 2px, transparent 2px),
      linear-gradient(90deg, black 0px, black 2px, transparent 2px);
    background-position: -1px -1px;
    
    .vacuum {
      position: absolute;
      transition: all 0.3s linear;
    }
  }

  .menu {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 20px;

    h2 {
      margin: 0;
    }
    p {
      font-size: 20px;
    }
    form {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 10px;
    }
    input {
      height: 40px;
    }
    button {
      cursor: pointer;
      height: 40px;
      padding: 0 20px;
      border-radius: 20px;
      color: black;
      text-transform: uppercase;
      font-weight: 700;
      background: #fff;
      border: 1px solid black;
      transition: all 0.2s ease-in-out;
    }
    button:hover {
      background: #000;
      color: #fff;
    }
    .controls-container {
      display: flex;
      align-items: flex-end;
      flex: 1 0 auto;
      gap: 10px;
    }
  }
</style>