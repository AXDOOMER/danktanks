////////////////////////////////////////////////////////////////////////////////
// ISC License
//
// Copyright (c) 2021, Alexandre-Xavier Labonté-Lamoureux
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
// OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.
////////////////////////////////////////////////////////////////////////////////

const RES = "res/";

/*================  HELPER FUNCTIONS  ================*/

function create_ground() {
	// Load a texture
	texture = new THREE.TextureLoader().load(RES + "ground.jpg");
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set(10, 10);

	// Create plane
	const geometry = new THREE.PlaneGeometry(50, 50, 1, 1);
	const material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide, map: texture});
	const plane = new THREE.Mesh(geometry, material);

	// Set position
	plane.rotation.x = Math.PI / 2;
	plane.position.y = -1;

	return plane;
}

function create_sky(scene) {
	const loader = new THREE.TextureLoader();
	scene.background = loader.load(RES + "sky.jpg");
	scene.background.wrapS = THREE.RepeatWrapping;
	scene.background.wrapT = THREE.RepeatWrapping;
	scene.background.repeat.set(0.25, 1);
	//scene.background.rotation = 0.1;
}

function create_moutains_box(scene) {
	moutain_texture = new THREE.TextureLoader().load(RES + "mountains.webp");

	const moutain_geometry = new THREE.PlaneGeometry(50, 10, 1, 1);
	const moutain_material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide, map: moutain_texture, transparent: true});
	const moutain_plane = new THREE.Mesh(moutain_geometry, moutain_material);

	moutain_plane.position.z = -25;
	scene.add(moutain_plane);

	const moutain_plane2 = new THREE.Mesh(moutain_geometry, moutain_material);
	moutain_plane2.position.z = 25;
	moutain_plane2.rotation.y = Math.PI;
	scene.add(moutain_plane2);

	const moutain_plane3 = new THREE.Mesh(moutain_geometry, moutain_material);
	moutain_plane3.position.x = 25;
	moutain_plane3.rotation.y = Math.PI / 2;
	scene.add(moutain_plane3);

	const moutain_plane4 = new THREE.Mesh(moutain_geometry, moutain_material);
	moutain_plane4.position.x = -25;
	moutain_plane4.rotation.y = -Math.PI / 2;
	scene.add(moutain_plane4);
}

function create_player_tank_base() {
	const textureLoader = new THREE.TextureLoader();

	let materialArray = [
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "tank_side.jpg")}),  // right
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "tank_side.jpg")}),  // left
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "tank_top2.jpg")}),  // top
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "tank_green.jpg")}), // bottom
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "tank_back.jpg")}),  // rear
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "tank_front.jpg")}), // front
	];

	const tank_base_geometry = new THREE.BoxGeometry(0.9, 0.5, 1.4);
	const tank_base = new THREE.Mesh(tank_base_geometry, materialArray);

	// Set position lower so it touches the ground
	tank_base.position.y = -0.75;
	tank_base.stuck = false;
	tank_base.time_since_last_engine_noise = 0;
	tank_base.speed = 0;

	return tank_base;
}

function create_player_tank_turret() {
	const textureLoader = new THREE.TextureLoader();

	let materialArray = [
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "tank_green.jpg")}), // right
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "tank_green.jpg")}), // left
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "tank_top1.jpg")}),  // top
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "tank_green.jpg")}), // bottom
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "tank_turret_back.jpg")}), // rear
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "tank_green.jpg")}), // front
	];

	const tank_turret_geometry = new THREE.BoxGeometry(0.6, 0.3, 0.6);
	const tank_turret = new THREE.Mesh(tank_turret_geometry, materialArray);

	tank_cannon = create_player_tank_cannon();

	group = new THREE.Object3D();
	group.add(tank_turret);
	group.add(tank_cannon);

	group.position.y = -0.35;
	group.time_since_last_shot = 0;

	return group;
}

function create_player_tank_cannon() {
	const textureLoader = new THREE.TextureLoader();

	const left_texture = textureLoader.load(RES + "tank_cannon.jpg");
	left_texture.wrapS = THREE.RepeatWrapping;
	left_texture.wrapT = THREE.RepeatWrapping;
	left_texture.rotation = Math.PI / 2;

	const right_texture = textureLoader.load(RES + "tank_cannon.jpg");
	right_texture.wrapS = THREE.RepeatWrapping;
	right_texture.wrapT = THREE.RepeatWrapping;
	right_texture.rotation = -Math.PI / 2;

	const bottom_texture = textureLoader.load(RES + "tank_cannon.jpg");
	bottom_texture.wrapS = THREE.RepeatWrapping;
	bottom_texture.wrapT = THREE.RepeatWrapping;
	bottom_texture.rotation = Math.PI;

	let materialArray = [
		new THREE.MeshBasicMaterial({map: right_texture}), // right
		new THREE.MeshBasicMaterial({map: left_texture}),  // left
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "tank_cannon.jpg")}), // top
		new THREE.MeshBasicMaterial({map: bottom_texture}), // bottom
		new THREE.MeshBasicMaterial({color: 0x1e290c}), // rear
		new THREE.MeshBasicMaterial({color: 0x000000}), // front
	];

	const tank_cannon_geometry = new THREE.BoxGeometry(0.1, 0.1, 0.8);
	const tank_cannon = new THREE.Mesh(tank_cannon_geometry, materialArray);

	tank_cannon.position.z = -0.69;

	return tank_cannon;
}

function createStats() {
	const stats = new Stats();
	stats.setMode(0);

	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0';
	stats.domElement.style.top = '0';

	return stats;
}

function create_bullet(px, py, pz, rx, ry, rz) {
	const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
	const material = new THREE.MeshBasicMaterial({color: 0xff0000});
	const cube = new THREE.Mesh(geometry, material);

	// Set position and direction
	cube.position.x = px;
	cube.position.y = py;
	cube.position.z = pz;
	cube.rotation.x = rx;
	cube.rotation.y = ry;
	cube.rotation.z = rz;

	// Set tic for lifetime counter
	cube.tics = 0;

	return cube;
}

function create_small_house(px, pz, ry) {
	const textureLoader = new THREE.TextureLoader();

	const roof_geometry = new THREE.ConeGeometry(3, 1.5, 4);
	const roof_texture = textureLoader.load(RES + "roof.jpg");
	roof_texture.rotation = -0.14;
	roof_texture.wrapS = THREE.RepeatWrapping;
	roof_texture.wrapT = THREE.RepeatWrapping;
	roof_texture.repeat.set(12, 3);
	const roof_material = new THREE.MeshBasicMaterial({color: 0xffffff, map: roof_texture});
	const roof = new THREE.Mesh(roof_geometry, roof_material);
	roof.position.y = 1.75;
	// Align roof with house
	roof.rotation.y = Math.PI / 4;

	let materialArray = [
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "wall_two_windows.jpg")}), // right
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "wall_two_windows.jpg")}), // left
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "roof.jpg")}), // top
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "ground.jpg")}), // bottom
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "wall_two_windows.jpg")}), // rear
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "door-small.jpg")}), // front
	];

	const house_geometry = new THREE.BoxGeometry(4, 2, 4);
	const house = new THREE.Mesh(house_geometry, materialArray);

	// Set position lower so it touches the ground
	house.position.y = 0;

	group = new THREE.Object3D();
	group.add(roof);
	group.add(house);

	// Init position and rotation on map
	group.position.x = px;
	group.position.z = pz;
	group.rotation.y = ry;
	group.radius = 2;

	return group;
}

function create_big_house(px, pz, ry) {
	const textureLoader = new THREE.TextureLoader();

	const roof_geometry = new THREE.ConeGeometry(4.3, 2, 4);
	const roof_texture = textureLoader.load(RES + "roof2.jpg");
	roof_texture.rotation = -0.12;
	roof_texture.wrapS = THREE.RepeatWrapping;
	roof_texture.wrapT = THREE.RepeatWrapping;
	roof_texture.repeat.set(10, 1);
	const roof_material = new THREE.MeshBasicMaterial({color: 0xffffff, map: roof_texture});
	const roof = new THREE.Mesh(roof_geometry, roof_material);
	roof.position.y = 3;
	// Align roof with house
	roof.rotation.y = Math.PI / 4;

	let house_material = [
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "wall_height_windows.jpg")}), // right
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "wall_height_windows.jpg")}), // left
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "roof.jpg")}), // top
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "ground.jpg")}), // bottom
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "wall_six_windows.jpg")}), // rear
		new THREE.MeshBasicMaterial({map: textureLoader.load(RES + "door-big.jpg")}), // front
	];

	const house_geometry = new THREE.BoxGeometry(6, 3, 6);
	const house = new THREE.Mesh(house_geometry, house_material);

	// Set position lower so it touches the ground
	house.position.y = 0.5;

	group = new THREE.Object3D();
	group.add(roof);
	group.add(house);

	// Init position and rotation on map
	group.position.x = px;
	group.position.z = pz;
	group.rotation.y = ry;
	group.radius = 3;

	return group;
}

/*================  INIT RENDERER  ================*/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 0.4;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/*================  INIT SOUNDS ================*/

/*
audioShot = new Audio(RES + "shot.mp3");
audioExplode = new Audio(RES + "explode.mp3");
audioEngine1 = new Audio(RES + "idle.mp3");
audioEngine2 = new Audio(RES + "speed1.mp3");
audioEngine3 = new Audio(RES + "speed2.mp3");
*/

// How to implement audio loop without gapping: https://stackoverflow.com/a/22446616

/*================  INIT GAME WORLD  ================*/

const world = new Object();
SPEED_MULTIPLIER = 0.5;

// Add terrain
world.ground = create_ground();
scene.add(world.ground);

// Add sky to scene
create_sky(scene);

// Add moutains around the box
create_moutains_box(scene);

// Add the player's tank
// tank base
world.tank_base = create_player_tank_base();
scene.add(world.tank_base);
// turret (with cannon)
world.tank_turret = create_player_tank_turret();
scene.add(world.tank_turret);

// Add stats to screen
stats = createStats();
document.body.appendChild(stats.domElement);

// Add array for bullets (they really are shells)
world.bullets = [];
// Add array for houses (buildings)
world.houses = [];


// Spawn some houses
world.houses.push(create_small_house(-2, -5, 0));
world.houses.push(create_small_house(10, 3, 0.5));
world.houses.push(create_small_house(-5, 8, 1.2));

world.houses.push(create_big_house(-10, 15, -1));
world.houses.push(create_big_house(19, -7, 1.6));

for (let i = 0; i < world.houses.length; i++) {
	scene.add(world.houses[i]);
}

/*================  INIT KEYBOARD  ================*/

// based on https://stackoverflow.com/a/12444641
// find out the key codes: https://keycode.info/

var map = {}; // You could also use an array
onkeydown = onkeyup = function(e) {
	e = e || event; // to deal with IE
	map[e.keyCode] = e.type == 'keydown';
}

/*================  INIT ANIMATION  ================*/

const animate = function () {
	setTimeout(function() {
		requestAnimationFrame(animate);
	}, 1000 / 60);

	/*============ UPDATE PLAYER =============*/

	// left arrow
	if (map[37]) {
		// turn left
		world.tank_base.rotation.y += 0.1 * SPEED_MULTIPLIER;
		world.tank_turret.rotation.y += 0.1 * SPEED_MULTIPLIER;
	}

	// right arrow
	if (map[39]) {
		// turn right
		world.tank_base.rotation.y -= 0.1 * SPEED_MULTIPLIER;
		world.tank_turret.rotation.y -= 0.1 * SPEED_MULTIPLIER;
	}

	// up arrow
	if (map[38]) {
		// move forward
		world.tank_base.position.x -= 0.2 * SPEED_MULTIPLIER * Math.sin(world.tank_base.rotation.y);
		world.tank_base.position.z -= 0.2 * SPEED_MULTIPLIER * Math.cos(world.tank_base.rotation.y);
	}


	// down arrow
	if (map[40]) {
		// move backwards
		world.tank_base.position.x += 0.2 * SPEED_MULTIPLIER * Math.sin(world.tank_base.rotation.y);
		world.tank_base.position.z += 0.2 * SPEED_MULTIPLIER * Math.cos(world.tank_base.rotation.y);
	}

	// comma or z
	if (map[188] || map[90]) {
		// turn turret left
		world.tank_turret.rotation.y += 0.1 * SPEED_MULTIPLIER;
	}

	// period or x
	if (map[190] || map[88]) {
		// turn turret right
		world.tank_turret.rotation.y -= 0.1 * SPEED_MULTIPLIER;
	}

	// page up
	if (map[33]) {
		// move camera up
		if (camera.position.y < 0.96) {
			camera.position.y += 0.05;
		}
	}

	// page down
	if (map[34]) {
		// move camera down
		if (camera.position.y > -0.80) {
			camera.position.y -= 0.05;
		}
	}

	// é or /
	if (map[191]) {
		// reset turret rotation and camera height
		camera.position.y = 0.4;
		world.tank_turret.rotation.y = world.tank_base.rotation.y;
	}

	// Update turret position on tank base
	world.tank_turret.position.x = world.tank_base.position.x + 0.2 * Math.sin(world.tank_base.rotation.y);
	world.tank_turret.position.z = world.tank_base.position.z + 0.2 * Math.cos(world.tank_base.rotation.y);

	// For camera to film tank from the rear
	camera.position.x = world.tank_base.position.x + 2.5 * Math.sin(world.tank_turret.rotation.y);
	camera.position.z = world.tank_base.position.z + 2.5 * Math.cos(world.tank_turret.rotation.y);
	//camera.position.y = world.tank_base.position.y;

	const xdiff = camera.position.x - world.tank_turret.position.x;
	const zdiff = camera.position.z - world.tank_turret.position.z;
	camera.rotation.y = Math.atan2(xdiff, zdiff);

	/*=========== UPDATE BULLETS ===============*/

	// space key
	if (map[32] || map[17]) {
		// fire
		const bullet = create_bullet(world.tank_turret.position.x - 0.65 * Math.sin(world.tank_turret.rotation.y),
		                             world.tank_turret.position.y,
		                             world.tank_turret.position.z - 0.65 * Math.cos(world.tank_turret.rotation.y),
		                             world.tank_turret.rotation.x, world.tank_turret.rotation.y, world.tank_turret.rotation.z);

		bullet.friendly = true;
		scene.add(bullet);
		world.bullets.push(bullet);
	}

	// Iterates backwards, process older bullets first
	// If these were two loops, it could be further optimized
	// by stopping processing when encountering bullets that are not expired
	for (let i = world.bullets.length - 1; i >= 0; i--) {
		const bullet = world.bullets[i];

		// Destroy if lifetime has expired
		if (bullet.tics > 60 * 3) {
			scene.remove(bullet);        // remove from renderer
			world.bullets.splice(i, 1);
			continue;
		}

		// Move
		bullet.position.x -= 0.5 * Math.sin(bullet.rotation.y);
		bullet.position.z -= 0.5 * Math.cos(bullet.rotation.y);
		bullet.tics += 1;
	}

	/*=========== UPDATE RENDERING ===============*/

	// scroll background left and right
	scene.background.offset = new THREE.Vector2(-camera.rotation.y / (Math.PI * 2), 0.6);

	renderer.render(scene, camera);

	stats.update();
};

animate();
