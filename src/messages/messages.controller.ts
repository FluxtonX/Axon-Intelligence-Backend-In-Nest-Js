import { Controller, Get, Param, Post, Query, UseGuards, Request, ParseIntPipe, DefaultValuePipe, Patch, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  getConversations(@Request() req) {
    return this.messagesService.getConversations(req.user.id);
  }

  @Post()
  sendMessage(
    @Request() req,
    @Body('receiverId') receiverId: string,
    @Body('content') content: string,
  ) {
    return this.messagesService.sendMessage(req.user.id, receiverId, content);
  }

  @Get('conversation/:otherUserId')
  getConversation(
    @Request() req,
    @Param('otherUserId') otherUserId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.messagesService.getConversation(req.user.id, otherUserId, page, limit);
  }

  @Get('unread/count')
  getUnreadCount(@Request() req) {
    return this.messagesService.getUnreadCount(req.user.id);
  }

  @Patch(':id/read')
  markAsRead(@Request() req, @Param('id') id: string) {
    return this.messagesService.markAsRead(id, req.user.id);
  }
}
