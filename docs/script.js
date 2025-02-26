document.addEventListener("DOMContentLoaded", function () {
    const katup1 = document.getElementById("katup_1");
    const katup2 = document.getElementById("katup_2");
    const katup3 = document.getElementById("katup_3");
    const katup4 = document.getElementById("katup_4");
    const debit = document.getElementById("debit");
    const pompa = document.getElementById("pompa");
    const saveBtn = document.getElementById("save-btn");

    // Load initial state from data.json
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            updateToggleButton(katup1, data.katup_1);
            updateToggleButton(katup2, data.katup_2);
            updateToggleButton(katup3, data.katup_3);
            updateToggleButton(katup4, data.katup_4);
            debit.value = data.debit;
            updateToggleButton(pompa, data.pompa);
        });

    // Toggle button functionality
    function updateToggleButton(button, state) {
        if (state === 1) {
            button.classList.add("on");
            button.textContent = "On";
        } else {
            button.classList.remove("on");
            button.textContent = "Off";
        }
    }

    katup1.addEventListener("click", () => toggleState(katup1));
    katup2.addEventListener("click", () => toggleState(katup2));
    katup3.addEventListener("click", () => toggleState(katup3));
    katup4.addEventListener("click", () => toggleState(katup4));
    pompa.addEventListener("click", () => toggleState(pompa));

    function toggleState(button) {
        if (button.classList.contains("on")) {
            button.classList.remove("on");
            button.textContent = "Off";
        } else {
            button.classList.add("on");
            button.textContent = "On";
        }
    }

    // Save changes
    saveBtn.addEventListener("click", () => {
        const updatedData = {
            katup_1: katup1.classList.contains("on") ? 1 : 0,
            katup_2: katup2.classList.contains("on") ? 1 : 0,
            katup_3: katup3.classList.contains("on") ? 1 : 0,
            katup_4: katup4.classList.contains("on") ? 1 : 0,
            debit: parseFloat(debit.value),
            pompa: pompa.classList.contains("on") ? 1 : 0,
        };

        fetch('data.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Changes saved successfully!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to save changes.');
        });
    });
});
