import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BusService } from './bus.service';

const createBus = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await BusService.createBus(req.body, token as  string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    data: result,
    message: 'Bus created successfully',
  });
});

const getAllBuses = catchAsync(async (req, res) => {
  const result = await BusService.getAllBuses();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'All buses fetched successfully',
    data: result,
  });
});

const getSingleBus = catchAsync(async (req, res) => {
  const { id: busId } = req.params;
  const result = await BusService.getSingleBus(busId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bus fetched successfully',
    data: result,
  });
});

const updateBus = catchAsync(async (req, res) => {
  const { id: busId } = req.params;
  const token = req.headers.authorization;
  const result = await BusService.updateBus(token as string, busId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bus updated successfully',
    data: result,
  });
});

const deleteBus = catchAsync(async (req, res) => {
  const { id: busId } = req.params;
  const token = req.headers.authorization;
  const result = await BusService.deleteBus(busId, token as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bus deleted successfully',
    data: result,
  });
});

export const BusController = {
  createBus,
  getAllBuses,
  getSingleBus,
  updateBus,
  deleteBus,
};
