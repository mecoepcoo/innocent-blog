/* 标签接口 */
var express = require('express');
var router = express.Router();
var TagModel = require('../../models/tag');
var PostModel = require('../../models/post');
var lang = require('../../lib/lang.json');
var checkLogin = require('../checkLogin').checkLogin;
var checkVisitor = require('../checkLogin').checkVisitor;

router.route('/tag')
  .get(checkVisitor, function (req, res, next) {
    var tagCollection;
    var tagQuery = TagModel.Tag.find({});
    tagQuery.exec(function (err, categories) {
      tagCollection = categories;
      res.json(200, tagCollection);
    });
  })
  .post(checkLogin, function (req, res, next) {
    var id = req.body.id;
    var name = req.body.name;

    if (!name.match(/^[A-z0-9\u4e00-\u9fa5\+\#\.\-]{0,20}$/)) {
      res.json(200, {
        status: 0,
        message: lang.illegalInput
      })
    } else if (id) {
      var tagQuery = TagModel.Tag.findOne().where('_id', id);
      tagQuery.exec(function (error, doc) {
        doc.name = name;
        doc.save(function (err) {
          if (err) {
            res.json(200, {
              status: 0,
              message: lang.error
            })
          } else {
            res.json(200, {
              status: 1,
              message: lang.success
            })
          }
        })
      })
    } else {
      var tagQuery = TagModel.Tag.findOne({'name': {$regex: '^' + name + '$', $options: '$i'}});
      tagQuery.exec(function (err, repeat) {
        if (repeat) {
          res.json(200, {
            status: 0,
            message: lang.error + ': 标签已存在'
          })
        } else {
          var newTag = new TagModel.Tag({
            name: name
          });
          newTag.save(function (err) {
            if (err) {
              res.json(200, {
                status: 0,
                message: lang.error
              });
            } else {
              res.json(200, {
                status: 1,
                message: lang.success
              });
            }
          })
        }
      });
    }
  })
  .delete(checkLogin, function (req, res, next) {
    var tagQuery = TagModel.Tag.find({'_id': {$in: req.body.id}});
    tagQuery.exec(function (err) {
      if (err) {
        res.json(200, {
          status: 0,
          message: lang.error
        })
      } else {
        tagQuery.remove(function (err, doc) {
          if (err) {
            res.json(200, {
              status: 0,
              message: lang.error
            })
          } else {
            res.json(200, {
              status: 1,
              message: lang.success,
              doc: doc
            })
          }
        });
      }
    })
  });

router.route('/taginfo')
  .get(checkVisitor, function (req, res, next) {
    PostModel.Post.aggregate({
      $project: {
        tags: 1
      }
    }).exec(function (err, doc) {
      if (err) {
        res.json(200, {
          status: 0,
          message: lang.error
        })
      } else {
        res.json(200, {
          status: 1,
          message: lang.success,
          data: doc
        })
      }
    })
  });


module.exports = router;