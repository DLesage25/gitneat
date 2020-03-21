const chalk = require('chalk');

const warning = text => {
    console.log(chalk.yellow(text));
    return true;
};

const success = text => {
    console.log(chalk.green(text));
    return true;
};

const error = text => {
    console.log(chalk.red(text));
    return true;
};

module.exports = { warning, success, error };
