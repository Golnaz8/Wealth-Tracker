const express = require('express');
const router = require('express').Router();
const { Transaction } = require('../../models');
const withAuth = require('../../utils/auth');


//create transaction
router.post('/', withAuth, async (req, res) => {
  try {
    const newTransaction = await Transaction.create({
      ...req.body,
      userId: req.session.user_id,
    });
    res.status(200).json(newTransaction);
  } catch (err) {
    res.status(400).json(err);
  }
});


//delete transaction
router.delete("/:id", async (req, res) => {
  try {
    const deleteTrData = await Transaction.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).json(deleteTrData);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});


//update transaction
router.put("/:id", withAuth, async (req, res) => {
  try {
    const updateResult = await Transaction.update(
      req.body,
      {
        where: {
          id: req.params.id,
        },
      });
    return res.status(200).json(updateResult);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});


module.exports = router;