// config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../models/User');

// ==================== LOCAL STRATEGY ====================
passport.use(User.createStrategy());

// ==================== GOOGLE OAUTH STRATEGY ====================
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
            user = await User.create({
                username: profile.displayName || profile.emails[0].value.split('@')[0],
                email: profile.emails[0].value,
                googleId: profile.id,
                profilePicture: profile.photos[0]?.value || '/images/default-avatar.JPEG'
            });
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// ==================== GITHUB OAUTH STRATEGY ====================
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ githubId: profile.id });
        
        if (!user) {
            user = await User.create({
                username: profile.username,
                email: profile.emails?.[0]?.value || null,
                githubId: profile.id,
                profilePicture: profile.photos[0]?.value || '/images/default-avatar.JPEG'
            });
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// ==================== DISCORD OAUTH STRATEGY ====================
passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: '/auth/discord/callback',
    scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ discordId: profile.id });
        
        if (!user) {
            user = await User.create({
                username: profile.username,
                email: profile.email || null,
                discordId: profile.id,
                profilePicture: profile.avatar 
                    ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
                    : '/images/default-avatar.JPEG'
            });
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// ==================== SERIALIZE/DESERIALIZE ====================
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;