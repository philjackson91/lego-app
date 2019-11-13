const { validationResult } = require("express-validator");

const Sets = require("../models/sets");
const Figures = require("../models/minifigures");
const Searches = require("../models/searches");
const User = require("../models/user");

exports.getSets = (req, res, next) => {
  Sets.find()
    .then(sets => {
      res.status(200).json({
        message: "Fetched sets successfully.",
        sets: sets
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.addSet = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  const name = req.body.name;
  const images = req.body.images;
  const SetNumber = req.body.setNumber;
  const pieceNumber = req.body.pieceNumber;
  const quality = req.body.quality;
  const minifigNumber = req.body.minifigNumber;
  const filters = req.body.filters;
  const description = req.body.description;
  const included = req.body.included;
  const year = req.body.year;
  images;
  const set = new Sets({
    name: name,
    images: images,
    SetNumber: SetNumber,
    pieceNumber: pieceNumber,
    quality: quality,
    minifigNumber: minifigNumber,
    filters: filters,
    description: description,
    included: included,
    year: year
  });
  set
    .save()
    .then(result => {
      res.status(201).json({
        message: "Set Added successfully!",
        set: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getFigures = (req, res, next) => {
  Figures.find()
    .then(figures => {
      res.status(200).json({
        message: "Fetched figures successfully.",
        figures: figures
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.addFigure = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  const name = req.body.name;
  const images = req.body.images;
  const SetNumber = req.body.setNumber;
  const appearsIn = req.body.appearsIn;
  const quality = req.body.quality;
  const filters = req.body.filters;
  const description = req.body.description;
  const included = req.body.included;
  const year = req.body.year;
  const fig = new Figures({
    name: name,
    images: images,
    SetNumber: SetNumber,
    appearsIn: appearsIn,
    quality: quality,
    filters: filters,
    description: description,
    included: included,
    year: year
  });
  fig
    .save()
    .then(result => {
      res.status(201).json({
        message: "fig Added successfully!",
        fig: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.editSet = (req, res, next) => {
  console.log(req.body);
  if (req.body.itemType === "set") {
    const name = req.body.name;
    const images = req.body.images;
    const SetNumber = req.body.SetNumber;
    const pieceNumber = req.body.pieceNumber;
    const quality = req.body.quality;
    const minifigNumber = req.body.minifigNumber;
    const filters = req.body.filters;
    const description = req.body.description;
    const included = req.body.included;
    const year = req.body.year;

    Sets.findOne({ SetNumber: SetNumber })
      .then(set => {
        if (!set) {
          const error = new Error(`A set with that ID could not be found.`);
          error.statusCode = 401;
          throw error;
        }
        set.name = name;
        set.images = images;
        set.SetNumber = SetNumber;
        set.pieceNumber = pieceNumber;
        set.quality = quality;
        set.minifigNumber = minifigNumber;
        set.filters = filters;
        set.description = description;
        set.included = included;
        set.year = year;
        return set.save();
      })
      .then(result => {
        res.status(200).json({ message: "set updated!", post: result });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  } else {
    const name = req.body.name;
    const images = req.body.images;
    const SetNumber = req.body.SetNumber;
    const appearsIn = req.body.appearsIn;
    const quality = req.body.quality;
    const filters = req.body.filters;
    const description = req.body.description;
    const included = req.body.included;
    const year = req.body.year;

    Figures.findOne({ SetNumber: req.body.SetNumber })
      .then(figure => {
        if (!figure) {
          const error = new Error("A figure with this ID could not be found.");
          error.statusCode = 401;
          throw error;
        }
        figure.name = name;
        figure.images = images;
        figure.SetNumber = SetNumber;
        figure.appearsIn = appearsIn;
        figure.quality = quality;
        figure.filters = filters;
        figure.description = description;
        figure.included = included;
        figure.year = year;
        return figure.save();
      })
      .then(result => {
        res.status(200).json({ message: "figure updated!", post: result });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  }
};

exports.getPreviousSearch = (req, res, next) => {
  Searches.find({ creator: req.userId })
    .then(user => {
      res.status(200).json({
        message: "Fetch successfully.",
        searches: user
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.postNewSearch = (req, res, next) => {
  const query = req.body.query;
  let creator;
  const newSearch = new Searches({
    query: query,
    creator: req.userId
  });
  newSearch
    .save()
    .then(result => {
      return User.findById(req.userId);
    })
    .then(user => {
      creator = user;
      user.previousSearches.push(newSearch);
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: "search added "
      });
    })
    .catch(err => {
      console.log(err);
    });
};
