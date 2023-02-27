import PostMessage from '../models/postMessage.js';
import mongoose from 'mongoose';

export async function getPosts (req, res) {
    try {
        const postMessages = await PostMessage.find();

        res.status(200).json(postMessages)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export async function createPost(req, res) {
    const post = req.body;
    const newPost = new PostMessage(post)
    try {
        await newPost.save()
        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({message: error.message})
    }
}

export async function updatePost(req, res) {
    const { id: _id } = req.params;
    const post = req.body

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id')
    
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true })
    
    res.json(updatedPost)
}
