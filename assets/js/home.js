(function () {
    var GROUP = {
        fun: "#F59E0B",
        live: "#3B82F6",
        podcast: "#14B8A6",
        dj: "#A855F7",
        teaching: "#38BDF8",
        sport: "#10B981",
        reactions: "#EC4899"
    };

    var JOBS = [
        {
            id: "live",
            label: "Live show",
            sounds: [
                ["Air Horn", "fun", 90, false, "0.4s"],
                ["Brass Hit", "dj", 80, false, "0.2s"],
                ["Crowd Boo", "reactions", 70, false, "0.6s"],
                ["Tension Riser", "dj", 75, false, "1.5s"],
                ["Victory Fanfare", "teaching", 85, false, "0.3s"],
                ["Countdown 3-2-1", "teaching", 80, false, "0.0s"],
                ["Champagne Pop", "fun", 65, false, "0.2s"],
                ["Referee Whistle", "sport", 88, false, "0.0s"]
            ]
        },
        {
            id: "stream",
            label: "Stream",
            sounds: [
                ["Comedy Intro", "podcast", 70, false, "0.8s"],
                ["Big Laugh", "fun", 78, false, "0.2s"],
                ["Crickets", "fun", 60, true, "1.2s"],
                ["Ba Dum Tss", "fun", 82, false, "0.0s"],
                ["Cash Register", "fun", 74, false, "0.2s"],
                ["Lofi Intro 3", "podcast", 55, true, "2.0s"],
                ["Romantic Intro", "podcast", 58, true, "1.6s"],
                ["Drum Beat", "dj", 68, true, "0.5s"]
            ]
        },
        {
            id: "class",
            label: "Class",
            sounds: [
                ["Class Welcome", "teaching", 72, false, "0.4s"],
                ["Correct Answer", "teaching", 80, false, "0.0s"],
                ["Attention Bell", "teaching", 76, false, "0.3s"],
                ["Countdown 3-2-1", "teaching", 84, false, "0.0s"],
                ["Clock Tick", "teaching", 40, true, "0.0s"],
                ["Victory Fanfare", "teaching", 86, false, "0.3s"],
                ["Cartoon Boing", "fun", 70, false, "0.0s"],
                ["Big Sigh", "fun", 62, false, "0.4s"]
            ]
        },
        {
            id: "dj",
            label: "DJ",
            sounds: [
                ["Drum Beat", "dj", 78, true, "0.4s"],
                ["Tension Riser", "dj", 74, false, "1.5s"],
                ["Lofi Intro", "podcast", 52, true, "2.0s"],
                ["Brass Hit", "dj", 86, false, "0.2s"],
                ["Piano Melody 2", "dj", 60, true, "1.2s"],
                ["Guitar Melody 2", "dj", 64, true, "1.0s"],
                ["Romantic Intro", "podcast", 56, true, "1.6s"],
                ["Lofi Intro 3", "podcast", 54, true, "2.0s"]
            ]
        }
    ];

    var phoneEl = document.getElementById("phoneGrid");
    var ipadEl = document.getElementById("ipadGrid");
    var sounds = JOBS[0].sounds;

    function cell(sound) {
        var node = document.createElement("i");
        node.style.setProperty("--c", GROUP[sound[1]] || "#4f5afc");
        node.textContent = sound[0];
        return node;
    }

    if (phoneEl && ipadEl) {
        sounds.slice(0, 4).forEach(function (sound) { phoneEl.appendChild(cell(sound)); });
        sounds.forEach(function (sound) { ipadEl.appendChild(cell(sound)); });
    }

    var bars = document.getElementById("bars");
    if (bars) {
        for (var n = 0; n < 72; n++) {
            var bar = document.createElement("i");
            var hi = 22 + Math.random() * 78;
            var lo = 8 + Math.random() * Math.min(24, hi * 0.35);
            bar.style.setProperty("--hi", hi.toFixed(1) + "%");
            bar.style.setProperty("--lo", lo.toFixed(1) + "%");
            bar.style.setProperty("--d", (3.4 + Math.random() * 5.2).toFixed(2) + "s");
            bar.style.setProperty("--delay", (-Math.random() * 7).toFixed(2) + "s");
            bars.appendChild(bar);
        }
    }

    document.querySelectorAll("#swatches button").forEach(function (btn) {
        btn.style.setProperty("--hex", btn.getAttribute("data-hex"));
        btn.addEventListener("click", function () {
            document.body.setAttribute("data-theme", btn.getAttribute("data-theme"));
            document.querySelectorAll("#swatches button").forEach(function (b) {
                b.classList.toggle("on", b === btn);
            });
        });
    });

})();
