const express = require("express");

const collectionController = require("../controllers/collection");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/sets", isAuth, collectionController.getSets);

router.post("/sets", isAuth, collectionController.addSet);

router.post("/delete-set", isAuth, collectionController.deleteSet);

router.get("/minifigs", isAuth, collectionController.getFigures);

router.post("/minifigs", isAuth, collectionController.addFigure);

router.post("/delete-figure", isAuth, collectionController.deleteFigure);

router.post("/edit", isAuth, collectionController.editSet);

router.get("/previousSearches", isAuth, collectionController.getPreviousSearch);

router.post("/addNewSearchQuery", isAuth, collectionController.postNewSearch);

module.exports = router;
