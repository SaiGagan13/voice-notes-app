app.get("/", (req, res) => {
  res.send("Voice Notes Backend Running 🚀");
});

app.listen(5000, () => console.log("Server running on port 5000"));