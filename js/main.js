import { initializeTheme } from './theme.js';
import { initializeNavigation } from './navigation.js';
import { initializeProjectFilters } from './project-filters.js';
import { initializeGitHubProfile } from './github-profile.js';
import { initializeFormValidation } from './form-validation.js';
import { initializeLocationMap } from './location-map.js';

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('has-js');

    initializeTheme();
    initializeNavigation();
    initializeProjectFilters();
    initializeGitHubProfile();
    initializeFormValidation();
    initializeLocationMap();
});
