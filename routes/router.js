const router = require('express').Router();
const database = include('databaseConnection');
const dbModel = include('databaseAccessLayer');
//const dbModel = include('staticData');
const userModel = include('models/web_user');
const petModel = include('models/pet');
const petTypeModel = include('models/pet_type');
const bcrypt = require('bcrypt');


// router.get('/', async (req, res) => {
// 	console.log("page hit");

// 	try {
// 		const result = await dbModel.getAllUsers();
// 		res.render('index', {allUsers: result});

// 		//Output the results of the query to the Heroku Logs
// 		console.log(result);
// 	}
// 	catch (err) {
// 		res.render('error', {message: 'Error reading from MySQL'});
// 		console.log("Error reading from mysql");
// 	}
// });


// router.post('/addUser', async (req, res) => {
//     console.log("form submit");
//     console.log(req.body);

// 	try {
// 		const success = await dbModel.addUser(req.body);
// 		if (success) {
// 			res.redirect("/");
// 		}
// 		else {
// 			res.render('error', {message: "Error writing to MySQL"});
// 			console.log("Error writing to MySQL");
// 		}
// 	}
// 	catch (err) {
// 		res.render('error', {message: "Error writing to MySQL"});
// 		console.log("Error writing to MySQL");
// 		console.log(err);
// 	}
// });

// router.get('/deleteUser', async (req, res) => {
//     console.log("delete user");

// 	console.log(req.query);

// 	let userId = req.query.id;

// 	if (userId) {
// 		const success = await dbModel.deleteUser(userId);
// 		if (success) {
// 			res.redirect("/");
// 		}
// 		else {
// 			res.render('error', {message: 'Error writing to MySQL'});
// 			console.log("Error writing to mysql");
// 			console.log(err);
// 		}
// 	}
// });


router.get('/', async (req, res) => {
	console.log("page hit");
	try {
		const users = await userModel.findAll({
			attributes:
				['web_user_id', 'first_name', 'last_name', 'email']
		}); //{where: {web_user_id:1}}

		if (users === null) {
			res.render('error', { message: 'Error connecting toMySQL' });
			console.log("Error connecting to userModel");
		}
		else {
			console.log(users);
			res.render('index', { allUsers: users });
		}
	}
	catch (ex) {
		res.render('error', { message: 'Error connecting to MySQL' });
		console.log("Error connecting to MySQL");
		console.log(ex);
	}
});

router.get('/deleteUser', async (req, res) => {
	try {
		console.log("delete user");
		let userId = req.query.id;
		if (userId) {
			console.log("userId: " + userId);
			let deleteUser = await userModel.findByPk(userId);
			console.log("deleteUser: ");
			console.log(deleteUser);
			if (deleteUser !== null) {
				await deleteUser.destroy();
			}
		}
		res.redirect("/");
	}
	catch (ex) {
		res.render('error', { message: 'Error connecting to MySQL' });
		console.log("Error connecting to MySQL");
		console.log(ex);
	}
});

router.post('/addUser', async (req, res) => {
	try {
		console.log("form submit");
		const password_hash = await bcrypt.hash(req.body.password, 12);
		let newUser = userModel.build(
			{
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				email: req.body.email,
				password_salt: password_hash
			}
		);
		await newUser.save();
		res.redirect("/");
	}
	catch (ex) {
		res.render('error', { message: 'Error connecting to MySQL' });
		console.log("Error connecting to MySQL");
		console.log(ex);
	}
});

router.get('/pets', async (req, res) => {
	try {
		// Assuming you have a function to fetch all pets from the database
		const pets = await petModel.findAll(); // Adjust this according to your Sequelize model
		console.log(pets);

		// Render the pets.ejs page and pass the pets data to it
		res.render('pets', { pets: pets });
	} catch (error) {
		console.error('Error fetching pets:', error);
		// Render an error page or send an error response as needed
		res.status(500).send('Internal Server Error');
	}
});

router.get('/showPets', async (req, res) => {
    console.log("page hit");
    try {
        let userId = req.query.id;
        const user = await userModel.findByPk(userId);
        if (user === null) {
            res.render('error', { message: 'Error connecting to MySQL' });
            console.log("Error connecting to userModel");
        } else {
            let pets = await user.getPets();
            console.log(pets);
            // Check if the user has any pets
            if (pets.length === 0) {
                res.render('error', { message: 'This user does not have any pets.' });
            } else {
                let owner = await pets[0].getOwner();
                console.log(owner);
                res.render('pets', { pets: pets });
            }
        }
    } catch (ex) {
        res.render('error', { message: 'Error connecting to MySQL' });
        console.log("Error connecting to MySQL");
        console.log(ex);
    }
});

module.exports = router;
