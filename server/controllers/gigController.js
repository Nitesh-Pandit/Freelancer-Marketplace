import Gig from '../models/Gig.js';

// CREATE GIG
export const createGig = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const userId = req.user.id; // From JWT middleware

    // Validation
    if (!title || !description || !price) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (title.length < 5) {
      return res.status(400).json({ error: 'Title must be at least 5 characters' });
    }

    if (description.length < 20) {
      return res.status(400).json({ error: 'Description must be at least 20 characters' });
    }

    if (price < 1) {
      return res.status(400).json({ error: 'Price must be greater than 0' });
    }

    // Get freelancer name from JWT or database
    // For now, we'll get it from a separate user lookup
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create new gig
    const newGig = new Gig({
      title: title.trim(),
      description: description.trim(),
      price,
      userId,
      freelancerName: user.name,
    });

    await newGig.save();

    return res.status(201).json({
      message: 'Gig created successfully!',
      gig: {
        id: newGig._id,
        title: newGig.title,
        description: newGig.description,
        price: newGig.price,
        userId: newGig.userId,
        freelancerName: newGig.freelancerName,
        createdAt: newGig.createdAt,
      },
    });
  } catch (error) {
    console.error('Create gig error:', error);
    return res.status(500).json({ error: 'Server error creating gig' });
  }
};

// GET ALL GIGS
export const getAllGigs = async (req, res) => {
  try {
    const gigs = await Gig.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'Gigs retrieved successfully',
      count: gigs.length,
      gigs,
    });
  } catch (error) {
    console.error('Get all gigs error:', error);
    return res.status(500).json({ error: 'Server error fetching gigs' });
  }
};

// GET FREELANCER'S GIGS
export const getFreelancerGigs = async (req, res) => {
  try {
    const userId = req.user.id; // From JWT middleware

    const gigs = await Gig.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: 'Freelancer gigs retrieved successfully',
      count: gigs.length,
      gigs,
    });
  } catch (error) {
    console.error('Get freelancer gigs error:', error);
    return res.status(500).json({ error: 'Server error fetching freelancer gigs' });
  }
};

// GET SINGLE GIG
export const getGigById = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    return res.status(200).json({
      message: 'Gig retrieved successfully',
      gig,
    });
  } catch (error) {
    console.error('Get gig error:', error);
    return res.status(500).json({ error: 'Server error fetching gig' });
  }
};

// UPDATE GIG
export const updateGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    const { title, description, price } = req.body;
    const userId = req.user.id; // From JWT middleware

    // Find gig
    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    // Check if user is the owner
    if (gig.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this gig' });
    }

    // Validation
    if (title && title.length < 5) {
      return res.status(400).json({ error: 'Title must be at least 5 characters' });
    }

    if (description && description.length < 20) {
      return res.status(400).json({ error: 'Description must be at least 20 characters' });
    }

    if (price && price < 1) {
      return res.status(400).json({ error: 'Price must be greater than 0' });
    }

    // Update gig
    if (title) gig.title = title.trim();
    if (description) gig.description = description.trim();
    if (price) gig.price = price;

    await gig.save();

    return res.status(200).json({
      message: 'Gig updated successfully!',
      gig: {
        id: gig._id,
        title: gig.title,
        description: gig.description,
        price: gig.price,
        userId: gig.userId,
        freelancerName: gig.freelancerName,
        createdAt: gig.createdAt,
        updatedAt: gig.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update gig error:', error);
    return res.status(500).json({ error: 'Server error updating gig' });
  }
};

// DELETE GIG
export const deleteGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    const userId = req.user.id; // From JWT middleware

    // Find gig
    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    // Check if user is the owner
    if (gig.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this gig' });
    }

    await Gig.findByIdAndDelete(gigId);

    return res.status(200).json({
      message: 'Gig deleted successfully!',
    });
  } catch (error) {
    console.error('Delete gig error:', error);
    return res.status(500).json({ error: 'Server error deleting gig' });
  }
};
