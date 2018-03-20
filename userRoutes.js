//*********************************************************************************************
//USER ROUTES
//*********************************************************************************************
app.get('/users', (req, res)=> {
    User 
        .find()
        .then(users=> {
            res.json(users.map((user) => user.serialize()));
        })
        .catch(err=>{
            console.error(err);
            res.status(500).json({error: "Internal server error"});
        });
});

app.get('/users/:id', (req,res)=> {
    User
        .findById(req.params.id)
        .then(user=>res.json(user.serialize()))
        .catch(err=>{
            console.error(err);
            res.status(500).json({error: "Internal server error"});
        });
});

