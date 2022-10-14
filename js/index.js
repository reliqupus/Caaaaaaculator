// I am a horrible js developer (I am not a js developer)
window.addEventListener('load', () => {
    // declare vars
    let previous = '';
    let current = '';
    let currentSign = null;
    let resultShowing = false; // special behaviour - when result shows, math can still be done on it, however input overrides everything.

    const definitionList = {
        "Enter": "=",
        "Backspace": "DEL",
    }

    const buttons = document.getElementsByClassName('button');
    const previousTextLine = document.getElementById('previous');
    const currentTextLine = document.getElementById('current');

    //utility
    function calc(sign) {
        switch (sign) {
            case '+':
                return Number(previous) + Number(current);
            
            case '-':
                return Number(previous) - Number(current);
            
            case '/':
                return Number(previous) / Number(current);
            
            case '*':
                return Number(previous) * Number(current);
        }
    }

    function signAction(sign) {
        if (current.length == 0) {
            current = 0;
        }

        if (currentSign == null) {
            previous = current;
            currentSign = sign;
            current = '';

            previousTextLine.textContent = previous + ' ' + currentSign;
        } else {
            previous = calc(currentSign);
            currentSign = sign;
            current = '';

            previousTextLine.textContent = previous + ' ' + currentSign;
            currentTextLine.textContent = previous;
        }
    }

    //special cases
    const specials = {
        "%": function () {
            if (previous.length != 0) {
                current = previous * current / 100;
                currentTextLine.textContent = current;
            } else {
                specials["C"]();
            }
        },

        "CE": function () {
            current = '';
            currentTextLine.textContent = '0';
        },

        "C": function () {
            current = '';
            previous = '';
            currentSign = null;
            
            currentTextLine.textContent = '0';
            previousTextLine.textContent = previous;

            resultShowing = false;
        },
        
        "DEL": function () {
            current = current.substring(0, current.length - 1);
            if (current.length == 0) {
                currentTextLine.textContent = '0';
            } else {
                currentTextLine.textContent = current;
            }
        },

        "=": function () {
            // need to do a lot of safety here? I dont know, I am not a js developer
            if (currentSign != null) {
                if (previous.length == 0) {
                    previous = 0;
                }

                if (current.length == 0) {
                    current = previous;
                }

                let result = calc(currentSign);

                currentTextLine.textContent = result;
                previousTextLine.textContent = previous + ' ' + currentSign + ' ' + current + ' =';

                current = result;
                previous = '';
                currentSign = null;
                
                resultShowing = true;
            } else {
                if (current.length == 0) {
                    current = '0';
                }

                previousTextLine.textContent = current + ' =';
                currentTextLine.textContent = current;

                current = '';
            }
        },

        "+": function () {
            signAction('+');
        },

        "-": function () {
            signAction('-');
        },

        "/": function () {
            signAction('/');
        },

        "*": function () {
            signAction('*');
        },

        ".": function () {
            if (current.length == 0) {
                current = '0.';
            } else if(current.charAt(current.length - 1) == '.') {
                return;
            } else {
                current = current + '.';
            }

            currentTextLine.textContent = current;
        },
    }

    // hook up events
    for (const button of buttons) {
        button.addEventListener('click', () => {
            if (specials[button.textContent]) {
                if (resultShowing) {
                    resultShowing = false;
                }

                specials[button.textContent]()
            } else {
                if (resultShowing) {
                    resultShowing = false;
                    specials['C']();
                }

                current = current + button.textContent;
                currentTextLine.textContent = current;
            }
        })
    }

    // hook up to input
    document.addEventListener("keydown", (input) => {
        // allow to read enter and backspace keys
        input.preventDefault();
        
        const specialAction = definitionList[input.key]
        if (specialAction) {
            specials[specialAction]()
            return
        }

        // handle all the special signs
        if (specials[input.key]) {
            specials[input.key]()
        }

        // handle numbers
        if (Number(input.key)) {
            current = current + input.key;
            currentTextLine.textContent = current;
        }
    })
})