import readline from "readline";
import axios from "axios";
import chalk from "chalk";
import ora from "ora";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getListPokemon() {
  const spinner = ora("Loading...\n").start();
  axios
    .get("https://pokeapi.co/api/v2/pokemon?limit=300")
    .then(function (response) {
      const pokemonList = response.data.results;

      console.log(chalk.green("Pokemon List :\n"));
      const itemsPerRow = 6;

      pokemonList.forEach(function (pokemon, index) {
        const pokemonName = `${index + 1}. ${pokemon.name}`;

        process.stdout.write(chalk.cyanBright(`${pokemonName.padEnd(10)}${(index + 1) % itemsPerRow === 0 ? "\n" : "\t"}`));
      });

      spinner.succeed(`Finish.\n`);
      rl.question("\nEnter the number or name of the pokemon that you want to choose : ", function (answer) {
        getPokemonName(answer);
      });
    })
    .catch(function (error) {
      console.log(`Error: ${error.message}`);
      spinner.fail("Can't reach the pokemon :(\n");
    });
}

function getPokemonName(pokemonName) {
  pokemonName = pokemonName.toLowerCase();
  axios
    .get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then(function (response) {
      const pokemon = response.data;

      console.log(`_̳_̳_̳_̳_̳_̳\n`);
      console.log(`Pokemon Name : ${pokemon.name}`);
      console.log(`Height       : ${pokemon.height}`);
      console.log(`Weight       : ${pokemon.weight}`);
      console.log(`Pokemon Type : ${pokemon.types.map((type) => type.type.name).join(", ")}`);
      console.log(`Abilities    : ${pokemon.abilities.map((ability) => ability.ability.name).join(" + ")}`);
      console.log(`_̳_̳_̳_̳_̳_̳\n`);

      repeatProgram();
    })
    .catch(function (error) {
      console.log(`Error: ${error.message}`);
      if (error.response.status === 404) {
        console.log(chalk.red(`\nPokemon Not Found!`));
        return startProgram();
      }
    });
}

function searchPokemonName() {
  rl.question(`\nEnter pokemon name : `, function (pokemonName) {
    pokemonName = pokemonName.toLowerCase();
    if (!isNaN(pokemonName)) {
      console.log(chalk.red("Invalid input."));
      searchPokemonName();
      return;
    }
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then(function (response) {
        const pokemon = response.data;
        console.log(`_̳_̳_̳_̳_̳_̳\n`);
        console.log(`Pokemon Name : ${pokemon.name}`);
        console.log(`Height       : ${pokemon.height}`);
        console.log(`Weight       : ${pokemon.weight}`);
        console.log(`Pokemon Type : ${pokemon.types.map((type) => type.type.name).join(", ")}`);
        console.log(`Abilities    : ${pokemon.abilities.map((ability) => ability.ability.name).join(" - ")}`);
        console.log(`_̳_̳_̳_̳_̳_̳\n`);

        repeatProgram();
      })
      .catch(function (error) {
        console.log(`Error: ${error.message}`);
        if (error.response.status === 404) {
          console.log(chalk.red(`\nPokemon Not Found!`));
        }
        rl.close();
      });
  });
}

function startProgram() {
  console.clear();
  console.log(
    chalk.cyanBright(`
  ██████╗░░█████╗░██╗░░██╗███████╗███╗░░░███╗██╗███╗░░██╗
  ██╔══██╗██╔══██╗██║░██╔╝██╔════╝████╗░████║██║████╗░██║
  ██████╔╝██║░░██║█████═╝░█████╗░░██╔████╔██║██║██╔██╗██║
  ██╔═══╝░██║░░██║██╔═██╗░██╔══╝░░██║╚██╔╝██║██║██║╚████║
  ██║░░░░░╚█████╔╝██║░╚██╗███████╗██║░╚═╝░██║██║██║░╚███║
  ╚═╝░░░░░░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░░░░╚═╝╚═╝╚═╝░░╚══╝`)
  );
  rl.question(`\n-- Welcome To Pokemin CLI -- \n Input the number to choose : \n\n 1. List Pokemon. \n 2. Search Your Pokemon Name. \n 3. Exit.\n` + `\n \t Input: `, function (answer) {
    if (answer == "1") {
      getListPokemon();
    } else if (answer == "2") {
      searchPokemonName();
    } else if (answer == "3") {
      rl.question(chalk.yellow(`Are you sure ? (y/n) : `), function (exitDecision) {
        if (exitDecision == "y") {
          console.log(`\nProgram Closed.`);
          rl.close();
        } else if (exitDecision == "n") {
          return startProgram();
        } else {
          console.log(chalk.red(`\n\n\n\nInvalid Input !`));
          startProgram();
        }
      });
    } else {
      console.log(chalk.red(`\n\n\n\nYour Input is Invalid!`));
      return startProgram();
    }
  });
}

startProgram();

function repeatProgram() {
  rl.question(`Still in the Program ? (y/n) : `, function (decision) {
    if (decision == "y") {
      startProgram();
    } else if (decision == "n") {
      console.log(chalk.cyanBright("\n\tProgram Closed.\n"));
      rl.close();
    } else {
      console.log(chalk.red(`\nInvalid Input!!\n`));
      repeatProgram();
    }
  });
}
