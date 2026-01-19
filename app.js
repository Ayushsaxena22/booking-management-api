const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect(
  "mongodb+srv://saxenaaayush2529_db_user:Ayush%402529@cluster0.pk6zcje.mongodb.net/testdb?appName=Cluster0"
)
.then(() => console.log("MongoDB Atlas Connected ✅"))
.catch(err => console.log(err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});

const User = mongoose.model("User", userSchema);

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  amount: Number
});

const Book = mongoose.model("Book", bookingSchema);

app.post("/add-user", async (req, res) => {
  try {
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const user = new User({ name, email, age });
    await user.save();

    res.status(201).json({
      success: true,
      message: "User saved successfully",
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User not saved",
      error: error.message
    });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  }
});

app.post("/add-booking", async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        message: "userId and amount are required"
      });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const booking = new Book({
      userId,
      amount
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Booking not saved",
      error: error.message
    });
  }
});
app.get("/allbooking",async(req,res)=>
{
    try{
        const book = await Book.find().populate("userId");


        res.status(200).json({
      success: true,
      message: "all booking fetched successfully",
      data: book
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  
    }
})
app.delete("/allbooking/:id",async(req,res)=>
{
    try{

    
    const { id }=req.params;
    if(!mongoose.Types.ObjectId.isValid(id))
    {
        res.status(200).json({
            success:false,
            message:"invalid id"
        });
    }
    const deleteuser=await Book.findByIdAndDelete(id);
    if(!deleteuser)
    {
        res.status(404).json({
            success:false,
            message:"user not found"
        });
    }
     res.status(200).json({
      success: true,
      message: "booking delete successfully",
      
    });
}
catch(error){
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
}

})

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.listen(3000, () => {
  console.log("Server started on port 3000 🚀");
});
