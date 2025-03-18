# Troubleshooting Guide

This directory contains documentation for common issues and their solutions in the RPG Game project.

## Common Issues

### 1. Next.js App Router Issues

- [Root Layout Missing Tags Error](./root-layout-error-research.md) - How we resolved the issue with missing HTML tags in the root layout

### 2. Game Engine Issues

- Excalibur.js initialization problems
- Canvas rendering issues
- Asset loading failures

### 3. Authentication Issues

- Login/registration flow problems
- Authentication state management

## Troubleshooting Process

When encountering an issue, follow these steps:

1. **Identify the exact error message**: Copy the full error trace from the console
2. **Check existing documentation**: See if the issue has been documented in this folder
3. **Check component structure**: Verify that components are correctly organized
4. **Check API endpoints**: Ensure any API calls are properly structured
5. **Check browser console**: Look for any JavaScript errors or warnings
6. **Check network tab**: Verify that API calls are returning expected responses
7. **Isolate the issue**: Try to create a minimal reproduction of the problem

## Adding New Troubleshooting Documentation

When adding new troubleshooting documentation:

1. Create a descriptive markdown file named after the issue
2. Include:
   - Error details/symptoms
   - Root cause analysis
   - Implemented solution
   - Best practices to avoid similar issues
3. Update this README.md with a link to your new document

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Excalibur.js Documentation](https://excaliburjs.com/docs/)
- [React Documentation](https://react.dev/) 