import { Controller, Get, Render } from '@nestjs/common';

@Controller('header')
export class HeaderController {
  @Get('home')
  @Render('home')
  getHome() {
    return {};
  }
  @Get('about')
  @Render('about')
  getAbout() {
    return {};
  }
  @Get('contact')
  @Render('contact')
  getContact() {
    return {};
  }
}
