import { Response } from "express";
import { validationResult } from "express-validator";
import {
  createGroupService,
  deleteGroupService,
  getGroupDetailsService,
  getGroupMembersService,
  getMyGroupsService,
  updateGroupService,
} from "../services/group.service";
import { AuthRequest } from "../types/auth";

export const createGroup = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const group = await createGroupService({
      title: req.body.title,
      members: req.body.members,
      createdBy: req.userId!,
    });

    return res.status(201).json({
      success: true,
      data: group,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyGroups = async (req: AuthRequest, res: Response) => {
  try {
    const groups = await getMyGroupsService(req.userId!);

    res.status(200).json({
      success: true,
      data: groups,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGroupDetails = async (req: AuthRequest, res: Response) => {
  try {
    const group = await getGroupDetailsService(req.params.groupId as string);

    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGroupMembers = async (req: AuthRequest, res: Response) => {
  try {
    const members = await getGroupMembersService(req.params.groupId as string);

    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateGroup = async (req: AuthRequest, res: Response) => {
  try {
    const group = await updateGroupService({
      groupId: req.params.groupId as string,
      userId: req.userId!,
      title: req.body.title,
    });

    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteGroup = async (req: AuthRequest, res: Response) => {
  try {
    await deleteGroupService({
      groupId: req.params.groupId as string,
      userId: req.userId!,
    });

    res.status(200).json({
      success: true,
      message: "Group deleted successfully",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
