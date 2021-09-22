// this page covers the admin page
const express = require('express')
const router = express.Router()
const newInvest = require('../models/invest')
const User = require('../models/register')
const moment = require('moment')

// ==============invest get route==============
router.get('/addInvest',(req, res)=>{
    let user = req.user
        res.render('pages/addInvest',{user})
    })
// =====invest post route===============
router.post('/addInvest/:id',async(req, res)=>{
    let id = req.params.id
    console.log(id)
    // =======formatting the date=================
    //  let pickUpDay = req.body.pickUpDay;
    //  let pickUpDayFormat = moment(pickUpDay).format("MMMM Do YYYY");

    //  ==================collecting the data to be saved i.e creating a new instance of the invest================
   await User.findById(id).then(async(user) =>{
        let Invest = new newInvest({ 
            kohtype: req.body.kohtype, 
            roi: req.body.roi, 
            duration:req.body.duration,
            amount: req.body.amount,
            details: req.body.details,
            fullName: user.fullName,
            email: user.email,
            userId:user.id
         })

        //  =============saving the invest tp the database=================
        await Invest.save().then(invest => {
            console.log('invest created successfully', invest)
            req.flash('success', 'your Investment Plan was created Successfully')
            res.redirect('/dashboard')
            return
        }).catch(err => {
            console.log(err)
            return req.flash('error', 'an error occured while creating a plan - please try again')
        })
    })


})


// ========success get Route===============
router.get('/dashboard', (req, res)=>{
    let adminInvest = req.user
    res.render('pages/dashboard', {adminInvest})
})

module.exports = router