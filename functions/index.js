const functions = require("firebase-functions");
const {setGlobalOptions} = functions;
const {onCall} = require("firebase-functions/https");
const {defineSecret} = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const { Resend } = require('resend');

setGlobalOptions({ maxInstances: 10 });

// Define the secret parameter
const resendApiKey = defineSecret("RESEND_API_KEY");

const FEEDBACK_CATEGORIES = {
  bug: { label: 'Bug Report', icon: '🐛' },
  feature: { label: 'Feature Request', icon: '✨' },
  ui: { label: 'UI/UX Feedback', icon: '🎨' },
  suggestion: { label: 'General Suggestion', icon: '💡' },
  other: { label: 'Other', icon: '📋' },
};

exports.sendFeedback = onCall({ secrets: [resendApiKey] }, async (data, context) => {
  try {
    // Initialize Resend with the secret API key
    const resend = new Resend(resendApiKey.value());
    
    // Debug: log the received data
    logger.info('Received data in sendFeedback function', { 
      data: data,
      dataType: typeof data,
      keys: data ? Object.keys(data) : 'no keys'
    });

    // Extract the actual data (it's nested in a data property)
    const actualData = data?.data || data || {};
    const { message, category, userEmail, userId } = actualData;

    // Validate input
    if (!message || message.trim().length === 0) {
      logger.error('Validation failed - empty message', { 
        message: message,
        messageLength: message ? message.length : 'undefined',
        category: category
      });
      throw new functions.https.HttpsError('invalid-argument', 'Feedback message is required');
    }

    if (message.length > 2000) {
      throw new functions.https.HttpsError('invalid-argument', 'Feedback message is too long (max 2000 characters)');
    }

    const categoryData = FEEDBACK_CATEGORIES[category] || FEEDBACK_CATEGORIES.other;
    const userInfo = context.auth || null;
    const resolvedUserId = userId || userInfo?.uid || 'Anonymous';
    const resolvedUserEmail = userEmail || userInfo?.token?.email || 'Not provided';

    logger.info('Sending feedback email', { 
      userId: resolvedUserId,
      category: category,
      messageLength: message.length 
    });

    // Send email using Resend
    const emailData = await resend.emails.send({
      from: 'feedback@resend.dev', // Using Resend's test domain
      to: ['chikaosro@gmail.com'],
      subject: `${categoryData.icon} ${categoryData.label} - Feedback from Kram App`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #007AFF; padding-bottom: 10px;">
            ${categoryData.icon} New ${categoryData.label} from Kram App
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #555;">Feedback Message:</h3>
            <p style="line-height: 1.6; color: #333; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="border-top: 1px solid #ddd; padding-top: 15px; margin-top: 20px;">
            <h4 style="color: #666; margin-bottom: 10px;">Sender Information:</h4>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; color: #666; font-weight: bold;">Category:</td>
                <td style="padding: 5px 0; color: #333;">${categoryData.label}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #666; font-weight: bold;">User ID:</td>
                <td style="padding: 5px 0; color: #333;">${resolvedUserId}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #666; font-weight: bold;">User Email:</td>
                <td style="padding: 5px 0; color: #333;">${resolvedUserEmail}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #666; font-weight: bold;">Timestamp:</td>
                <td style="padding: 5px 0; color: #333;">${new Date().toISOString()}</td>
              </tr>
            </table>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
            <p style="color: #888; font-size: 12px;">
              This feedback was sent from the Kram mobile app.
            </p>
          </div>
        </div>
      `,
    });

    logger.info('Feedback email sent successfully', { emailId: emailData.data?.id });
    
    return {
      success: true,
      message: 'Feedback sent successfully',
      emailId: emailData.data?.id
    };
  } catch (error) {
    // If it's already an HttpsError, rethrow as-is
    if (error instanceof functions.https.HttpsError) {
      logger.error('Error sending feedback email', { code: error.code, message: error.message });
      throw error;
    }
    logger.error('Error sending feedback email', { error: error?.message || String(error) });
    throw new functions.https.HttpsError('internal', 'Failed to send feedback email');
  }
});
