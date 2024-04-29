// Name: Sandra Sorensen
// Asssigment: Build a path

class Path extends Phaser.Scene {
    // Class variable definitions -- these are all "undefined" to start
    graphics; // Graphics object for drawing lines
    curve; // The spline curve used for creating paths
    path; // Not used currently
    runModeFlag; // Flag to determine if the game is in run mode

    constructor() {
        super("pathMaker");
    }

    preload() {
        // Set the path for loading assets
        this.load.setPath("./assets/");
        // Load images for marking points and the enemy ship
        this.load.image("x-mark", "numeralX.png"); // x marks the spot
        this.load.image("enemyShip", "enemyGreen1.png"); // spaceship that runs along the path
    }

    create() {
        // Create a curve, initially populated with sample points for display
        this.points = [
            20, 20,
            80, 400,
            300, 750
        ];
        this.curve = new Phaser.Curves.Spline(this.points);

        // Initialize Phaser graphics for drawing
        this.graphics = this.add.graphics();

        // Define key bindings for user interaction
        this.ESCKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.oKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
        this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // Draw initial graphics
        this.xImages = [];
        this.drawPoints(); // Draw x marks at each point
        this.drawLine(); // Draw the spline line

        // Create mouse event handler for adding points with clicks
        this.mouseDown = this.input.on('pointerdown', (pointer) => {
            this.addPoint({ x: pointer.x, y: pointer.y });
            this.drawLine();
        });

        // Set the run mode flag to false initially
        this.runModeFlag = false;

        // Create enemyShip sprite as a follower of the curve
        my.sprite.enemyShip = this.add.follower(this.curve, 10, 10, "enemyShip");
        my.sprite.enemyShip.visible = false;

        // Update the description in the HTML document
        document.getElementById('description').innerHTML = '<h2>Path.js</h2><br>ESC: Clear points <br>O - output points <br>R - run mode';
    }

    // Draws an x mark at every point along the spline.
    drawPoints() {
        for (let point of this.curve.points) {
            this.xImages.push(this.add.image(point.x, point.y, "x-mark"));
        }
    }

    // Clear points
    // Removes all of the points, and then clears the line and x-marks
    clearPoints() {
        this.curve.points = [];
        this.graphics.clear();
        for (let img of this.xImages) {
            img.destroy();
        }
    }

    // Add a point to the spline
    addPoint(point) {
        this.curve.addPoint(point);
        this.xImages.push(this.add.image(point.x, point.y, "x-mark"));
    }

    // Draws the spline
    drawLine() {
        this.graphics.clear(); // Clear the existing line
        this.graphics.lineStyle(2, 0xffffff, 1); // Set line style to a white line
        this.curve.draw(this.graphics, 32); // Draw the spline with a thickness of 32
    }

    update() {
        // Handle keyboard input

        // Check if the ESC key is pressed
        if (Phaser.Input.Keyboard.JustDown(this.ESCKey)) {
            console.log("Clear path");

            // Check if run mode is active
            if (this.runModeFlag) {
                // Do nothing if run mode is active
            }
            else {
                // Clear the points if not in run mode
                this.clearPoints();
            }
        }

        // Check if the O key is pressed
        if (Phaser.Input.Keyboard.JustDown(this.oKey)) {
            console.log("Output the points");

            // Output the points comprising the spline
            for (let point of this.curve.points) {
                console.log("Points: ", [point.x, point.y]);
            }
        }

        // Check if the R key is pressed
        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            // Toggle run mode
            this.runModeFlag = !this.runModeFlag;

            // If run mode is active
            if (this.runModeFlag) {
                console.log("Run mode");
                // Check if there are points on the curve
                if (this.curve.points[0] != null) {
                    // Set enemyShip properties and make it visible
                    my.sprite.enemyShip.visible = true;
                    my.sprite.enemyShip.x = this.curve.points[0].x;
                    my.sprite.enemyShip.y = this.curve.points[0].y;
                    // Start following the curve with specified configuration
                    my.sprite.enemyShip.startFollow({
                        from: 0,
                        to: 1,
                        delay: 0,
                        duration: 2000,
                        ease: 'Sine.easeInOut',
                        repeat: -1,
                        yoyo: true,
                        rotateToPath: true,
                        rotationOffset: -90
                    });
                }
            }
            else { // If run mode is not active
                // Stop following the curve and hide the enemyShip sprite
                my.sprite.enemyShip.stopFollow();
                my.sprite.enemyShip.visible = false;
            }
        }
    }
}
