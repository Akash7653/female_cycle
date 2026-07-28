import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';
import { getCycles, addCycle, updateCycle, deleteCycle } from '../controllers/cycleController.js';
import { bloomFlowerForCycle } from '../controllers/flowerController.js';

const router = Router();
router.use(protect);

router.get('/', getCycles);
router.post('/', validate(schemas.cycle), async (req, res, next) => {
  try {
    req.body.user = req.user._id;
    const cycle = await (await import('../models/Cycle.js')).Cycle.create(req.body);
    if (cycle.endDate) await bloomFlowerForCycle(req.user._id, cycle);
    res.status(201).json({ cycle });
  } catch (e) { next(e); }
});
router.put('/:id', validate(schemas.cycle), async (req, res, next) => {
  try {
    const Cycle = (await import('../models/Cycle.js')).Cycle;
    const cycle = await Cycle.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true },
    );
    if (!cycle) return res.status(404).json({ message: 'Cycle not found.' });
    if (cycle.endDate) await bloomFlowerForCycle(req.user._id, cycle);
    res.json({ cycle });
  } catch (e) { next(e); }
});
router.delete('/:id', deleteCycle);

export default router;
