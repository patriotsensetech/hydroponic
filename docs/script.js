document.addEventListener("DOMContentLoaded", function () {
    const GITHUB_TOKEN = "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"; // Ganti dengan token GitHub Anda
    const REPO_OWNER = "patriotsensetech";
    const REPO_NAME = "hydroponic";
    const FILE_PATH = "docs/data.json";
    const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

    const katup1 = document.getElementById("katup_1");
    const katup2 = document.getElementById("katup_2");
    const katup3 = document.getElementById("katup_3");
    const katup4 = document.getElementById("katup_4");
    const debit = document.getElementById("debit");
    const pompa = document.getElementById("pompa");
    const saveBtn = document.getElementById("save-btn");

    let currentSha = ""; // Untuk menyimpan SHA file terbaru

    // Fungsi untuk mengambil data terbaru dari GitHub
    async function fetchLatestData() {
        try {
            const response = await fetch(API_URL, {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                },
            });
            const data = await response.json();
            currentSha = data.sha; // Simpan SHA file
            return JSON.parse(atob(data.content)); // Decode base64 content
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    }

    // Fungsi untuk mengupdate data di GitHub
    async function updateData(newData) {
        const encodedContent = btoa(JSON.stringify(newData, null, 2)); // Encode ke base64
        try {
            const response = await fetch(API_URL, {
                method: "PUT",
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: "Update data.json via web interface",
                    content: encodedContent,
                    sha: currentSha, // Gunakan SHA terbaru
                }),
            });
            const result = await response.json();
            console.log("Data updated successfully:", result);
            alert("Changes saved successfully!");
        } catch (error) {
            console.error("Error updating data:", error);
            alert("Failed to save changes.");
        }
    }

    // Load initial state from data.json
    fetchLatestData().then(data => {
        if (data) {
            updateToggleButton(katup1, data.katup_1);
            updateToggleButton(katup2, data.katup_2);
            updateToggleButton(katup3, data.katup_3);
            updateToggleButton(katup4, data.katup_4);
            debit.value = data.debit;
            updateToggleButton(pompa, data.pompa);
        }
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
    saveBtn.addEventListener("click", async () => {
        const updatedData = {
            katup_1: katup1.classList.contains("on") ? 1 : 0,
            katup_2: katup2.classList.contains("on") ? 1 : 0,
            katup_3: katup3.classList.contains("on") ? 1 : 0,
            katup_4: katup4.classList.contains("on") ? 1 : 0,
            debit: parseFloat(debit.value),
            pompa: pompa.classList.contains("on") ? 1 : 0,
        };

        await updateData(updatedData);
    });
});
