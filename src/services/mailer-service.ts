import nodemailer from 'nodemailer'
import { Reservation } from '../models/reservation-model'

export class MailerService {
  private transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      host: "smtp.gmail.com",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    })
  }

  async sendReservationEmail(toEmail: string, reservation: Reservation) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL,
        to: toEmail,
        subject: 'Reservation Confirmation',
        text: `Dear ${reservation.client?.name}, your reservation is confirmed for ${reservation.date} at ${reservation.hour}.`
      })

      console.log('Email sent successfully')
    } catch (error) {
      console.error('Error sending email:', error)
      
      throw new Error('Failed to send email')
    }
  }
}
