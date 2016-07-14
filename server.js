/*jshint esversion: 6 */
//import express
var express = require('express');
var restaurantController = express();
//temporary usage of fs to get json data
//var fs = require('fs');
var mongoose = require('mongoose');
//to deal with json parsing
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
//import local files
var Restaurant = require('./server/restaurant.js');
var ph = require('./server/promisehelpers.js');
var config = require('./server/config.js');
var Stores = require('./server/models/store.js');
var Menu = require('./server/models/menu.js');
//set folder for static content
restaurantController.use('static', express.static('public'));
//use bodyparser for all routes
restaurantController.use(bodyParser.json());
/*
 * Function to set the first page to load
 * @return - sends the index.html file back
 */
restaurantController.get('/', function(req, res) {
    //send index page back to requestor
    res.sendFile(__dirname + '/public/index.html');
});
/*
 * Function to get the stores information
 * @return - res with 201 and store / res with 500 error
 */
restaurantController.get('/store', function(req, res) {
    //get the store data from mongo and log results or reject reason
    ph.promiseLogging(Stores.getStore('FOod r Us'))
        //if succesful then return 201 with the store data
        .then(function(item) {
            res.status(201).json(item);
            //if there was an error, return 500
        }).catch(function() {
            res.status(500);
        });
});
/*
 * Function to create a store
 * @return - res with 201 and store / res with 500 error
 */
restaurantController.post('/store', function(req, res) {
    //create store data in mongo and log results or reject reason
    ph.promiseLogging(Stores.createStore('FOod r Us3', '313 somewhere', 'nowehere', 'fl', '33412', '6.5', '20'))
        //if succesful then return 201 with the store data
        .then(function(item) {
            res.status(201).json(item);
            //if there was an error, return 500
        }).catch(function() {
            res.status(500);
        });
});
/*
 * Function to create a menu item
 * @return - res with 201 and menu item / res with 500 error
 */
restaurantController.post('/menuitem', function(req, res) {
    //create menu item in mongo and log results or reject reason
    ph.promiseLogging(Menu.createItem('burger', '7.99', ['lunch', 'burgers', 'dinner']))
        //if succesful then return 201 with the menu item data
        .then(function(item) {
            res.status(201).json(item);
            //if there was an error, return 500
        }).catch(function() {
            res.status(500);
        });
});
/*
 * Function to update a menu item
 * @return - res with 201 and menu item / res with 500 error
 * (item that was updated, not updated item)
 */
restaurantController.put('/menuitem', function(req, res) {
    //update menu item in mongo and log results or reject reason
    ph.promiseLogging(Menu.updateItem('burger', 'cheeseburger', '10.99', ['lunch', 'burgers', 'dinner']))
        //if succesful then return 201 with the menu item data
        .then(function(item) {
            res.status(201).json(item);
            //if there was an error, return 500
        }).catch(function() {
            res.status(500);
        });
});
/*
 * Function to delete a menu item
 * @return - res with 201 and menu item / res with 500 error
 */
restaurantController.delete('/menuitem', function(req, res) {
    //delete menu item in mongo and log results or reject reason
    ph.promiseLogging(Menu.deleteItem('cheeseburger'))
        //if succesful then return 201 with the menu item data
        .then(function(item) {
            res.status(201).json(item);
            //if there was an error, return 500
        }).catch(function() {
            res.status(500);
        });
});
/*
 * Function to get the entire menu
 * @return - res with 201 and menu / res with 500 error
 */
restaurantController.get('/menu', function(req, res) {
    //get entire menu from mongo and log results or reject reason
    ph.promiseLogging(Menu.getMenu())
        //if succesful then return 201 with the menu data
        .then(function(item) {
            res.status(201).json(item);
            //if there was an error, return 500
        }).catch(function() {
            res.status(500);
        });
});
//TODO stub placeholders
// restaurantController.post('/order', function(req, res) {
//     //if there is no body in the request
//     if (!req.body) {
//         //return error code 400
//         return res.sendStatus(400);
//     }
//     ph.promiseAllLogging([
//             //TODO remove later
//             restaurantModel.addDinnersToTable(2, 3),
//             //add order to tables dinner
//             restaurantModel
//             .addGuestOrder(req.body.table_number,
//                 req.body.dinner_number,
//                 req.body.order)
//         ])
//         //if there are no error return 200 status
//         .then(function() {
//             res.sendStatus(200);
//         })
//         //otherwise return 400 status
//         .catch(function() {
//             res.sendStatus(400);
//         });
// });
/*
 *
 */
function runServer(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }
        //start listening on specified port for requests
        restaurantController.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
}
if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
}

//declaration and initialize restaurant and set to have 5 tables
//var restaurantModel = new Restaurant(5);
//get the restaurant data from the json file and log results or reject reason
//ph.promiseLogging(
//    restaurantModel.getRestaurantData()
//);
//export for testing
//exports.app = restaurantController;
//exports.storage = restaurantModel;
exports.runServer = runServer;
