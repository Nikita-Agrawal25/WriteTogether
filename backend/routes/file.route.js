const express = require('express');
const File = require('../models/File');
const  nodemailer= require('nodemailer')
const router = express.Router();

// Create a new file
router.post('/createFile', async (req, res) => {
    const {name, email, teamName} = req.body;
    // console.log(name);
    try{
      const fileExist = await File.findOne({name, email, teamName});
      if(fileExist){
        return res.status(409).json({message: 'File name already exists'});
      }
      const newFile = new File({name, email, teamName});
      await newFile.save();
      res.status(201).json({ message: 'File created', file: newFile });
      // console.log('Team created');
    } catch (error){
        res.json({message: 'Failed to create file', error});
      }
  });


// Fetch all files
router.get('/fetchFiles', async (req, res) => {
  // console.log({email, teamName});
    const {email, teamName} = req.query;
    try{
        const files = await File.find({email, teamName});
        // console.log(files);
        res.status(200).json(files);
    } catch (error) {
        res.status(500).json({message: 'Error while fetching files', error});
    }
});


// Edit a particular file
router.patch('/:id', async (req, res) => {
  const fileId = req.params.id;
  const {name, email, teamName} = req.body;
  // console.log(req.body);
  try{
    const fileNameExist = await File.findOne({name, email, teamName});
    if(fileNameExist){
      // console.log("file name exist")
      return res.status(201).json({message: 'File name already exist'});
    } 
    const newName = await File.findByIdAndUpdate(fileId, {name}, {new: true});
    res.status(200).json(newName);
  } catch (error){
    console.error('Error while updating:', error);
    res.status(500).json({message: 'Error while updating', error});
  }
});


// Delete a particular file
router.delete('/', async (req, res) => {
    console.log(req.query);
    const {fileId, teamName} = req.query;
    if(fileId){
      try{
        const deletedFile = await File.findByIdAndDelete(fileId);
        res.status(200).json({message: 'File deleted successfully', file: deletedFile});
      } catch(error){
        res.status(500).json({message: 'Failed to delete file'})
      }
    }
    if(teamName){
      try{
        const deletedFiles = await File.deleteMany({teamName});
        res.status(200).json({message: 'All files deleted successfully', file: deletedFiles});
      } catch(error){
        res.status(500).json({message: 'Failed to delete files'});
      }
    }
});


// fetch a particular file
router.get('/:id', async (req, res) => {
    const fileId = req.params.id;
    const exactFileId = fileId.replace(/:/g, '');
    try{
        const fetchFile = await File.findOne({_id: exactFileId});
        res.status(200).json({ message: 'File fetched', file: fetchFile});
    } catch(error){
        console.log('Error fetching file', error);
        res.status(404).json({message: 'Faield to fetch file', error})
    }
})


// Save content to a file
router.post("/save", async (req, res) => {
    // console.log(req.body);
    const {fileId, content} = req.body;
    const exactFileId = fileId.replace(/:/g, '');
    try{
      const file = await File.findByIdAndUpdate({_id: exactFileId}, {content }, {new: true, runvalidators: true}
      );
      res.status(200).json({message: "File content saved"});
      // console.log("File content saved");
    } catch (error){
      console.error("Error saving file content:", error);
      res.status(500).json({message: "Failed to save file content"});
    }
});

// // Share file
// router.post("/share", async (req, res) => {
//   const {fileId, email} = req.body;
//   const exactFileId = fileId.replace(/:/g, '');
//   try{
//     const file = await File.findByIdAndUpdate({_id: exactFileId},
//       {$push: {permissions: {email, role: 'write'}}},
//       {new: true, runvalidators: true}
//     );    
//     if (!file) {
//       return res.status(404).json({ message: "File not found" });
//     }    
//     res.status(200).json({shareId: exactFileId});
//     // console.log("File content saved");
//   } catch (error){
//     console.error("Error sharing file:", error);
//     res.status(500).json({message: "Failed to share file"});
//   }
// });


// router.post("/shared/:id", async (req, res) => {
//   const {id} = req.params;
//   const exactFileId = id.replace(/:/g, '');
//   try{
//     const file = await File.findOne({_id: exactFileId});
//     if (!file) {
//       return res.status(404).json({message: "File not found"});
//     }
//     const permission = file.permissions.find(p => p.email === req.body.email);
//     if (!permission) {
//       return res.status(403).json({message: "Permission denied"});
//     }    
//     res.status(200).json({message: "File fetched", file});
//     // console.log("File content saved");
//   } catch (error){
//     console.error("Error fetching shared file:", error);
//     res.status(500).json({message: "Failed to fetch shared file"});
//   }
// });



// Share file
router.post("/share", async (req, res) => {
  const { fileId, email } = req.body;
  const exactFileId = fileId.replace(/:/g, '');

  try {
      // const file = await File.findByIdAndUpdate(
      //     { _id: exactFileId },
      //     { $push: { permissions: { email, role: 'write' } } },
      //     { new: true, runValidators: true }
      // );

      // if (!file) {
      //     return res.status(404).json({ message: "File not found" });
      // }

      // Configure nodemailer
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          secure: true,
          port: 456,
          auth: {
              user: process.env.EMAIL_ID, 
              pass: process.env.PASSWORD, 
          },
      });

      const shareUrl = `http://localhost:3000/editor/${exactFileId}`;

      // Send the email
      await transporter.sendMail({
          from: '"WriteTogether" <your-email@gmail.com>',
          to: email,
          subject: "You've been invited to collaborate!",
          html: `
              <p>Hello,</p>
              <p>You've been invited to collaborate on a document.</p>
              <p>Click the link below to access it:</p>
              <a href="${shareUrl}">${shareUrl}</a>
          `,
      });

      res.status(200).json({ message: "File shared and email sent successfully", shareId: exactFileId });
  } catch (error) {
      console.error("Error sharing file:", error);
      res.status(500).json({ message: "Failed to share file", error });
  }
});

// Check shared file permission
router.post("/shared/:id", async (req, res) => {
  const { id } = req.params;
  const exactFileId = id.replace(/:/g, '');
  try {
      const file = await File.findOne({ _id: exactFileId });
      if (!file) {
          return res.status(404).json({ message: "File not found" });
      }
      const permission = file.permissions.find(p => p.email === req.body.email);
      if (!permission) {
          return res.status(403).json({ message: "Permission denied" });
      }
      res.status(200).json({ message: "File fetched", file });
  } catch (error) {
      console.error("Error fetching shared file:", error);
      res.status(500).json({ message: "Failed to fetch shared file" });
  }
});

   

module.exports = router;